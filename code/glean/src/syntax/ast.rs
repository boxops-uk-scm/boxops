use std::{fmt, sync::Arc};

pub type Symbol = string_interner::DefaultSymbol;
pub type Span = std::ops::Range<usize>;

struct DebugFn(Box<dyn Fn(&mut fmt::Formatter<'_>) -> fmt::Result>);

impl fmt::Debug for DebugFn {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        (self.0)(f)
    }
}

#[derive(Clone)]
pub struct Spanned<T> {
    pub span: Span,
    pub node: T,
}

impl<T: fmt::Debug> fmt::Debug for Spanned<T> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.node.fmt(f)?;
        write!(f, " @ {:?}", self.span)
    }
}

impl<T> Spanned<T> {
    pub fn new(span: Span, node: T) -> Self {
        Self { span, node }
    }

    pub fn fmap<U>(self, f: impl FnOnce(T) -> U) -> Spanned<U> {
        Spanned {
            span: self.span,
            node: f(self.node),
        }
    }
}

pub struct Query {
    pub span: Span,
    pub head: Pattern,
    pub body: Box<[Spanned<Statement>]>,
}

impl fmt::Debug for Query {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("Query")
            .field("head", &self.head)
            .field("body", &self.body)
            .finish()?;

        write!(f, " @ {:?}", self.span)
    }
}

#[derive(Debug)]
pub enum Statement {
    FilterStatement(Filter),
    BindStatement { lhs: Pattern, rhs: Pattern },
    ImplicitBindStatement { rhs: Pattern },
}

#[derive(Debug)]
pub struct Predicate {
    pub namespace: Box<[Spanned<Symbol>]>,
    pub name: Spanned<Symbol>,
}

#[derive(Debug, Clone)]
pub struct Field<T> {
    pub name: Spanned<Symbol>,
    pub value: T,
}

impl<T> Field<T> {
    pub fn fmap<U>(self, f: impl FnOnce(T) -> U) -> Field<U> {
        Field {
            name: self.name,
            value: f(self.value),
        }
    }

    pub fn fmap_ref<U>(&self, f: impl FnOnce(&T) -> U) -> Field<U> {
        Field {
            name: self.name.clone(),
            value: f(&self.value),
        }
    }
}

pub struct Pattern {
    pub span: Span,
    pub kind: Box<PatternKind<Pattern>>,
}

impl fmt::Debug for Pattern {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let root = self.cata(&|kind: PatternKind<DebugFn>| {
            DebugFn(Box::new(move |f| fmt::Debug::fmt(&kind, f)))
        });
        fmt::Debug::fmt(&root, f)
    }
}

impl Pattern {
    pub fn new(span: Span, kind: PatternKind<Self>) -> Self {
        Self {
            span,
            kind: Box::new(kind),
        }
    }

    pub fn cata<A>(&self, alg: &impl Fn(PatternKind<A>) -> A) -> A {
        alg(self.kind.fmap_ref(|c| c.cata(alg)))
    }

    pub fn para<A>(&self, alg: &impl Fn(&Pattern, PatternKind<A>) -> A) -> A {
        alg(self, self.kind.fmap_ref(|c| c.para(alg)))
    }
}

type RecordFields<T> = Box<[Spanned<Field<T>>]>;

#[derive(Debug)]
pub enum PatternKind<T> {
    Wildcard,
    Int(i64),
    String(Symbol),
    StringPrefix(Symbol),
    Variable(Symbol),
    FieldAccess {
        base: T,
        fields: Box<[Spanned<Symbol>]>,
    },
    Not(T),
    Or(Box<[T]>),
    Subquery(Arc<Query>),
    Record(RecordFields<T>),
    Fact {
        predicate: Arc<Predicate>,
        fields: RecordFields<T>,
    },
}

impl<T> PatternKind<T> {
    pub fn fmap<U>(self, mut f: impl FnMut(T) -> U) -> PatternKind<U> {
        match self {
            PatternKind::Wildcard => PatternKind::Wildcard,
            PatternKind::Int(i) => PatternKind::Int(i),
            PatternKind::String(s) => PatternKind::String(s),
            PatternKind::StringPrefix(s) => PatternKind::StringPrefix(s),
            PatternKind::Variable(v) => PatternKind::Variable(v),
            PatternKind::Not(p) => PatternKind::Not(f(p)),
            PatternKind::Or(ps) => PatternKind::Or(ps.into_iter().map(f).collect()),
            PatternKind::Subquery(q) => PatternKind::Subquery(q),
            PatternKind::FieldAccess { base, fields } => PatternKind::FieldAccess {
                base: f(base),
                fields,
            },
            PatternKind::Record(flds) => PatternKind::Record(
                flds.into_iter()
                    .map(|sf| sf.fmap(|field| field.fmap(&mut f)))
                    .collect::<Vec<_>>()
                    .into(),
            ),
            PatternKind::Fact { predicate, fields } => PatternKind::Fact {
                predicate,
                fields: fields
                    .into_iter()
                    .map(|sf| sf.fmap(|field| field.fmap(&mut f)))
                    .collect::<Vec<_>>()
                    .into(),
            },
        }
    }

    pub fn fmap_ref<U>(&self, mut f: impl FnMut(&T) -> U) -> PatternKind<U> {
        match self {
            PatternKind::Wildcard => PatternKind::Wildcard,
            PatternKind::Int(n) => PatternKind::Int(*n),
            PatternKind::String(s) => PatternKind::String(*s),
            PatternKind::StringPrefix(s) => PatternKind::StringPrefix(*s),
            PatternKind::Variable(s) => PatternKind::Variable(*s),
            PatternKind::FieldAccess { base, fields } => PatternKind::FieldAccess {
                base: f(base),
                fields: fields.clone(),
            },
            PatternKind::Not(p) => PatternKind::Not(f(p)),
            PatternKind::Or(alts) => PatternKind::Or(alts.iter().map(f).collect::<Vec<_>>().into()),
            PatternKind::Subquery(q) => PatternKind::Subquery(Arc::clone(q)),
            PatternKind::Record(flds) => PatternKind::Record(
                flds.iter()
                    .map(|sf| Spanned {
                        span: sf.span.clone(),
                        node: Field {
                            name: sf.node.name.clone(),
                            value: f(&sf.node.value),
                        },
                    })
                    .collect::<Vec<_>>()
                    .into(),
            ),
            PatternKind::Fact { predicate, fields } => PatternKind::Fact {
                predicate: Arc::clone(predicate),
                fields: fields
                    .iter()
                    .map(|sf| Spanned {
                        span: sf.span.clone(),
                        node: Field {
                            name: sf.node.name.clone(),
                            value: f(&sf.node.value),
                        },
                    })
                    .collect::<Vec<_>>()
                    .into(),
            },
        }
    }
}

pub struct Filter {
    pub span: Span,
    pub kind: Box<FilterKind<Filter>>,
}

impl Filter {
    pub fn new(span: Span, kind: FilterKind<Filter>) -> Self {
        Self {
            span,
            kind: Box::new(kind),
        }
    }

    pub fn cata<A>(&self, alg: &impl Fn(FilterKind<A>) -> A) -> A {
        alg(self.kind.fmap_ref(|c| c.cata(alg)))
    }

    pub fn para<A>(&self, alg: &impl Fn(&Filter, FilterKind<A>) -> A) -> A {
        alg(self, self.kind.fmap_ref(|c| c.para(alg)))
    }
}

impl fmt::Debug for Filter {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let root = self.cata(&|kind: FilterKind<DebugFn>| {
            DebugFn(Box::new(move |f| fmt::Debug::fmt(&kind, f)))
        });
        fmt::Debug::fmt(&root, f)
    }
}

#[derive(Debug, Clone, Copy)]
pub enum CmpOp {
    Eq,
    Neq,
    Lt,
    Gt,
    Lte,
    Gte,
}

#[derive(Debug)]
pub enum FilterKind<T> {
    Or(Box<[T]>),
    And(Box<[T]>),
    Not(T),
    Cmp {
        op: CmpOp,
        left: Box<Expr>,
        right: Box<Expr>,
    },
}

impl<T> FilterKind<T> {
    pub fn fmap<U>(self, mut f: impl FnMut(T) -> U) -> FilterKind<U> {
        match self {
            FilterKind::Or(fs) => FilterKind::Or(fs.into_iter().map(f).collect::<Vec<_>>().into()),
            FilterKind::And(fs) => {
                FilterKind::And(fs.into_iter().map(f).collect::<Vec<_>>().into())
            }
            FilterKind::Not(ft) => FilterKind::Not(f(ft)),
            FilterKind::Cmp { op, left, right } => FilterKind::Cmp { op, left, right },
        }
    }

    pub fn fmap_ref<U>(&self, mut f: impl FnMut(&T) -> U) -> FilterKind<U> {
        match self {
            FilterKind::Or(fs) => FilterKind::Or(fs.iter().map(f).collect::<Vec<_>>().into()),
            FilterKind::And(fs) => FilterKind::And(fs.iter().map(f).collect::<Vec<_>>().into()),
            FilterKind::Not(ft) => FilterKind::Not(f(ft)),
            FilterKind::Cmp { op, left, right } => FilterKind::Cmp {
                op: *op,
                left: left.clone(),
                right: right.clone(),
            },
        }
    }
}

#[derive(Clone)]
pub struct Expr {
    pub span: Span,
    pub kind: Box<ExprKind<Expr>>,
}

impl fmt::Debug for Expr {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let root = self
            .cata(&|kind: ExprKind<DebugFn>| DebugFn(Box::new(move |f| fmt::Debug::fmt(&kind, f))));
        fmt::Debug::fmt(&root, f)
    }
}

impl Expr {
    pub fn new(span: Span, kind: ExprKind<Self>) -> Self {
        Self {
            span,
            kind: Box::new(kind),
        }
    }

    pub fn cata<A>(&self, alg: &impl Fn(ExprKind<A>) -> A) -> A {
        alg(self.kind.fmap_ref(|c| c.cata(alg)))
    }

    pub fn para<A>(&self, alg: &impl Fn(&Expr, ExprKind<A>) -> A) -> A {
        alg(self, self.kind.fmap_ref(|c| c.para(alg)))
    }
}

#[derive(Debug, Clone, Copy)]
pub enum ArithOp {
    Plus,
    Minus,
}

#[derive(Debug, Clone)]
pub enum ExprKind<T> {
    Int(i64),
    String(Symbol),
    Variable {
        name: Symbol,
        fields: Box<[Spanned<Symbol>]>,
    },
    Negate(T),
    BinaryOp {
        op: ArithOp,
        left: T,
        right: T,
    },
}

impl<T> ExprKind<T> {
    pub fn fmap<U>(self, mut f: impl FnMut(T) -> U) -> ExprKind<U> {
        match self {
            ExprKind::Int(n) => ExprKind::Int(n),
            ExprKind::String(s) => ExprKind::String(s),
            ExprKind::Variable { name, fields } => ExprKind::Variable { name, fields },
            ExprKind::Negate(e) => ExprKind::Negate(f(e)),
            ExprKind::BinaryOp { op, left, right } => ExprKind::BinaryOp {
                op,
                left: f(left),
                right: f(right),
            },
        }
    }

    pub fn fmap_ref<U>(&self, mut f: impl FnMut(&T) -> U) -> ExprKind<U> {
        match self {
            ExprKind::Int(n) => ExprKind::Int(*n),
            ExprKind::String(s) => ExprKind::String(*s),
            ExprKind::Variable { name, fields } => ExprKind::Variable {
                name: *name,
                fields: fields.clone(),
            },
            ExprKind::Negate(e) => ExprKind::Negate(f(e)),
            ExprKind::BinaryOp { op, left, right } => ExprKind::BinaryOp {
                op: *op,
                left: f(left),
                right: f(right),
            },
        }
    }
}
