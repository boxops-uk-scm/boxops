use std::collections::HashMap;

use crate::syntax::ast::{Expr, ExprKind};

pub type TyVar = u32;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Type {
    Int,
    Str,
    Bool,
    Var(TyVar),
    Record(Box<[FieldType]>),
}

impl Type {
    pub fn typeof_field(&self, field: &str) -> Option<Type> {
        match self {
            Type::Record(fields) => fields
                .iter()
                .find(|f| f.name == field)
                .map(|f| f.ty.clone()),
            _ => None,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct FieldType {
    pub name: String,
    pub ty: Type,
}

#[derive(Debug, Clone)]
pub enum TypeError {
    Mismatch { expected: Type, found: Type },
    InfiniteType { var: TyVar },
    UnboundVariable { name: String },
    MissingField { record: Type, field: String },
}

#[derive(Default)]
pub struct Subst(HashMap<TyVar, Type>);

impl Subst {
    pub fn apply(&self, ty: &Type) -> Type {
        match ty {
            Type::Var(v) => match self.0.get(v) {
                Some(t) => self.apply(t),
                None => Type::Var(*v),
            },
            _ => ty.clone(),
        }
    }

    pub fn occurs(&self, var: TyVar, ty: &Type) -> bool {
        matches!(self.apply(ty), Type::Var(v) if v == var)
    }

    pub fn bind(&mut self, var: TyVar, ty: Type) -> Result<(), TypeError> {
        if let Type::Var(v) = ty {
            if v == var {
                return Ok(());
            }
        }
        if self.occurs(var, &ty) {
            return Err(TypeError::InfiniteType { var });
        }
        self.0.insert(var, ty);
        Ok(())
    }
}

pub fn unify(s: &mut Subst, t1: &Type, t2: &Type) -> Result<(), TypeError> {
    let t1 = s.apply(t1);
    let t2 = s.apply(t2);
    match (t1, t2) {
        (Type::Int, Type::Int) | (Type::Str, Type::Str) | (Type::Bool, Type::Bool) => Ok(()),
        (Type::Var(v), ty) | (ty, Type::Var(v)) => s.bind(v, ty),
        (t1, t2) => Err(TypeError::Mismatch {
            expected: t1,
            found: t2,
        }),
    }
}

#[derive(Default)]
pub struct FreshTyVar {
    next: TyVar,
}

impl FreshTyVar {
    pub fn fresh(&mut self) -> Type {
        let var = self.next;
        self.next += 1;
        Type::Var(var)
    }
}

#[derive(Default, Clone)]
pub struct TyEnv(HashMap<String, Type>);

impl TyEnv {
    pub fn insert(&mut self, name: String, ty: Type) {
        self.0.insert(name, ty);
    }

    pub fn get(&self, name: &str) -> Option<&Type> {
        self.0.get(name)
    }
}

pub type PredicateId = u32;

#[derive(Default, Debug, Clone)]
pub struct Schema {
    pub predicates: HashMap<PredicateId, PredicateSchema>,
}

#[derive(Debug, Clone)]
pub struct PredicateSchema {
    pub name: String,
    pub key_type: Type,
    pub value_type: Type,
}

#[derive(Default)]
pub struct TyCtx {
    env: TyEnv,
    subst: Subst,
    fresh: FreshTyVar,
    schema: Schema,
}

impl TyCtx {
    pub fn fresh(&mut self) -> Type {
        self.fresh.fresh()
    }

    pub fn unify(&mut self, t1: &Type, t2: &Type) -> Result<(), TypeError> {
        unify(&mut self.subst, t1, t2)
    }

    pub fn apply(&self, ty: &Type) -> Type {
        self.subst.apply(ty)
    }
}

pub fn synthesize_field_access(
    cts: &mut TyCtx,
    base: &Type,
    field: &str,
) -> Result<Type, TypeError> {
    unimplemented!()
}

pub fn synthesize_expr(ctx: &mut TyCtx, expr: &Expr) -> Result<Type, TypeError> {
    match expr.kind.as_ref() {
        ExprKind::Int(_) => Ok(Type::Int),
        ExprKind::String(_) => Ok(Type::Str),
        _ => unimplemented!(),
    }
}
