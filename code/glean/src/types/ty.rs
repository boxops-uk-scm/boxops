use std::{cell::RefCell, collections::BTreeMap, rc::Rc};

use crate::syntax::ast::Symbol;

pub enum TypeError {
    InfiniteType(TyVarId),
    Mismatch { expected: Ty, got: Ty },
}

pub type TyVarId = u32;

#[derive(Debug, Clone)]
pub struct TyVarCell(Rc<RefCell<Option<Ty>>>);

impl PartialEq for TyVarCell {
    fn eq(&self, _: &Self) -> bool {
        true
    }
}

impl Eq for TyVarCell {}

impl PartialOrd for TyVarCell {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
    }
}

impl Ord for TyVarCell {
    fn cmp(&self, _: &Self) -> std::cmp::Ordering {
        std::cmp::Ordering::Equal
    }
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
pub enum Ty {
    Error,
    Never,
    Int,
    String,
    Bool,
    Union(Box<[Ty]>),
    Var(TyVarId, TyVarCell),
    Record(BTreeMap<Symbol, Ty>),
}

pub struct TxLog {
    writes: Vec<(TyVarCell, Option<Ty>)>,
}

impl TxLog {
    pub fn new() -> Self {
        TxLog { writes: Vec::new() }
    }

    pub fn record(&mut self, cell: &TyVarCell) {
        self.writes.push((cell.clone(), cell.0.borrow().clone()));
    }

    pub fn set(&mut self, cell: &TyVarCell, val: Option<Ty>) {
        self.record(cell);
        *cell.0.borrow_mut() = val;
    }

    pub fn transact<T, E>(&mut self, f: impl FnOnce(&mut TxLog) -> Result<T, E>) -> Result<T, E> {
        let checkpoint = self.writes.len();
        let result = f(self);
        if result.is_err() {
            for (cell, prev) in self.writes.drain(checkpoint..).rev() {
                *cell.0.borrow_mut() = prev;
            }
        }
        result
    }
}

impl Ty {
    fn union_normalized(tys: impl IntoIterator<Item = Ty>) -> Self {
        let mut flat = tys
            .into_iter()
            .flat_map(|ty| match ty {
                Ty::Union(inner) => inner.into_vec(),
                other => vec![other],
            })
            .filter(|ty| *ty != Ty::Never)
            .collect::<Vec<_>>();

        flat.sort();
        flat.dedup();

        assert!(
            flat.iter().all(|ty| ty.is_ground()),
            "union types must be ground"
        );

        match flat.len() {
            0 => Ty::Never,
            1 => flat.into_iter().next().unwrap(),
            _ => Ty::Union(flat.into_boxed_slice()),
        }
    }

    fn union(tys: impl IntoIterator<Item = Ty>) -> Self {
        Self::union_normalized(tys.into_iter().map(|ty| ty.zonk()))
    }

    pub fn union_tx(tys: impl IntoIterator<Item = Ty>, log: &mut TxLog) -> Self {
        Self::union_normalized(tys.into_iter().map(|ty| ty.zonk_tx(log)))
    }

    fn record(fields: impl IntoIterator<Item = (Symbol, Ty)>) -> Self {
        Ty::Record(fields.into_iter().collect())
    }

    fn zonk(&self) -> Ty {
        match self {
            Ty::Var(_, TyVarCell(cell)) => {
                let current = cell.borrow().clone();

                match current {
                    None => self.clone(),
                    Some(ty) => {
                        let zonked = ty.zonk();
                        cell.replace(Some(zonked.clone()));
                        zonked
                    }
                }
            }
            Ty::Union(tys) => Ty::union(tys.iter().map(|ty| ty.zonk())),
            Ty::Record(fields) => Ty::record(fields.iter().map(|(k, v)| (*k, v.zonk()))),
            Ty::Error | Ty::Int | Ty::String | Ty::Bool | Ty::Never => self.clone(),
        }
    }

    fn zonk_tx(&self, log: &mut TxLog) -> Ty {
        match self {
            Ty::Var(_, cell) => {
                let current = cell.0.borrow().clone();

                match current {
                    None => self.clone(),
                    Some(ty) => {
                        let zonked = ty.zonk_tx(log);
                        log.set(cell, Some(zonked.clone()));
                        zonked
                    }
                }
            }
            Ty::Union(tys) => Ty::union(tys.iter().map(|ty| ty.zonk_tx(log))),
            Ty::Record(fields) => Ty::record(fields.iter().map(|(k, v)| (*k, v.zonk_tx(log)))),
            Ty::Error | Ty::Int | Ty::String | Ty::Bool | Ty::Never => self.clone(),
        }
    }

    fn is_ground(&self) -> bool {
        match self {
            Ty::Var(_, _) => false,
            Ty::Union(tys) => tys.iter().all(Ty::is_ground),
            Ty::Record(fields) => fields.values().all(Ty::is_ground),
            Ty::Error | Ty::Int | Ty::String | Ty::Bool | Ty::Never => true,
        }
    }

    fn occurs(id: TyVarId, ty: &Ty) -> bool {
        match ty {
            Ty::Var(var_id, _) => *var_id == id,
            Ty::Union(tys) => tys.iter().any(|ty| Self::occurs(id, ty)),
            Ty::Record(fields) => fields.values().any(|ty| Self::occurs(id, ty)),
            Ty::Error | Ty::Int | Ty::String | Ty::Bool | Ty::Never => false,
        }
    }

    pub fn bind(id: TyVarId, cell: &TyVarCell, ty: Ty, log: &mut TxLog) -> Result<(), TypeError> {
        log.transact(|log| Self::bind_inner(id, cell, ty, log))
    }

    fn bind_inner(id: TyVarId, cell: &TyVarCell, ty: Ty, log: &mut TxLog) -> Result<(), TypeError> {
        let ty = ty.zonk_tx(log);

        if matches!(ty, Ty::Var(other_id, _) if other_id == id) {
            return Ok(());
        }

        if Self::occurs(id, &ty) {
            return Err(TypeError::InfiniteType(id));
        }

        log.set(cell, Some(ty));
        Ok(())
    }

    pub fn unify(a: &Ty, b: &Ty, log: &mut TxLog) -> Result<(), TypeError> {
        log.transact(|log| Self::unify_inner(a, b, log))
    }

    fn unify_inner(a: &Ty, b: &Ty, log: &mut TxLog) -> Result<(), TypeError> {
        let a_zonked = a.zonk_tx(log);
        let b_zonked = b.zonk_tx(log);

        match (a_zonked, b_zonked) {
            (Ty::Error, _) | (_, Ty::Error) => Ok(()),

            (Ty::Var(id, cell), ty) => Ty::bind_inner(id, &cell, ty, log),
            (ty, Ty::Var(id, cell)) => Ty::bind_inner(id, &cell, ty, log),

            (Ty::Record(fields_a), Ty::Record(fields_b)) => {
                if fields_a.len() != fields_b.len() || fields_a.keys().ne(fields_b.keys()) {
                    return Err(TypeError::Mismatch {
                        expected: a.clone(),
                        got: b.clone(),
                    });
                }

                fields_a
                    .values()
                    .zip(fields_b.values())
                    .try_for_each(|(ty_a, ty_b)| Self::unify_inner(ty_a, ty_b, log))
            }

            (ty_a, ty_b) if ty_a == ty_b => Ok(()),

            _ => Err(TypeError::Mismatch {
                expected: a.clone(),
                got: b.clone(),
            }),
        }
    }
}
