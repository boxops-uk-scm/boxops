use std::cell::RefCell;
use std::sync::Arc;
use string_interner::DefaultStringInterner;

use super::ast::*;
use super::cst::*;
use super::lexer::Token;
use super::parser::Rule;

#[derive(Debug)]
pub enum Lowered {
    Query(Query),
    StmtList(Box<[Spanned<Statement>]>),
    Statement(Spanned<Statement>),
    Pattern(Pattern),
    Filter(Filter),
    Expr(Expr),
    FieldList(Box<[Spanned<Field<Pattern>>]>),
    Field(Spanned<Field<Pattern>>),
    IntermediateFact {
        predicate: Arc<Predicate>,
        fields: Box<[Spanned<Field<Pattern>>]>,
    },
    UId(Spanned<Symbol>),
    LId(Spanned<Symbol>),
    Nat(Spanned<u32>),
    Str(Spanned<Symbol>),
    Wildcard(Span),
    CmpOp(Spanned<CmpOp>),
    ArithOp(Spanned<ArithOp>),
    Trivia,
}

pub struct Lowering {
    pub interner: RefCell<DefaultStringInterner>,
}

impl Lowering {
    pub fn new() -> Self {
        Self {
            interner: RefCell::new(DefaultStringInterner::default()),
        }
    }

    pub fn lower<'s>(&self, cst: &'s CstNode<'s>) -> Query {
        let Lowered::Query(q) = cst.para(&|kind| self.algebra(kind)) else {
            unreachable!()
        };

        q
    }

    fn intern<'s>(&self, s: &'s str) -> Symbol {
        self.interner.borrow_mut().get_or_intern(s)
    }

    fn algebra<'s>(&self, kind: CstKind<'s, (CstNode<'s>, Lowered)>) -> Lowered {
        match kind {
            CstKind::Rule {
                rule: Rule::Compilation,
                children,
                ..
            } => children
                .into_iter()
                .find_map(|(_, lowered)| match lowered {
                    Lowered::Query(query) => Some(Lowered::Query(query)),
                    _ => None,
                })
                .expect("compilation has a query"),
            CstKind::Rule {
                rule: Rule::Query,
                span,
                children,
            } => {
                let mut head = None;
                let mut body = None;

                for (_, lowered) in children {
                    match lowered {
                        Lowered::Pattern(p) => head = Some(p),
                        Lowered::StmtList(s) => body = Some(s),
                        _ => {}
                    }
                }

                Lowered::Query(Query {
                    span,
                    head: head.expect("query has a head pattern"),
                    body: body.expect("query has a body"),
                })
            }
            CstKind::Rule {
                rule: Rule::StmtList,
                children,
                ..
            } => Lowered::StmtList(
                children
                    .into_iter()
                    .filter_map(|(_, lowered)| match lowered {
                        Lowered::Statement(stmt) => Some(stmt),
                        _ => None,
                    })
                    .collect(),
            ),
            CstKind::Rule {
                rule: Rule::FilterStmt,
                span,
                children,
            } => {
                let f = children
                    .into_iter()
                    .find_map(|(_, l)| match l {
                        Lowered::Filter(f) => Some(f),
                        _ => None,
                    })
                    .expect("filter statement has a filter");
                Lowered::Statement(Spanned::new(span, Statement::FilterStatement(f)))
            }

            CstKind::Rule {
                rule: Rule::BindStmt,
                span,
                children,
            } => {
                let mut pats = children.into_iter().filter_map(|(_, l)| match l {
                    Lowered::Pattern(p) => Some(p),
                    _ => None,
                });
                Lowered::Statement(Spanned::new(
                    span,
                    Statement::BindStatement {
                        lhs: pats.next().expect("bind statement has a lhs pattern"),
                        rhs: pats.next().expect("bind statement has a rhs pattern"),
                    },
                ))
            }

            CstKind::Rule {
                rule: Rule::ImplicitBindStmt,
                span,
                children,
            } => {
                let p = children
                    .into_iter()
                    .find_map(|(_, l)| match l {
                        Lowered::Pattern(p) => Some(p),
                        _ => None,
                    })
                    .expect("implicit bind statement has a pattern");
                Lowered::Statement(Spanned::new(
                    span,
                    Statement::ImplicitBindStatement { rhs: p },
                ))
            }
            CstKind::Rule {
                rule: Rule::Pattern,
                span,
                children,
            } => {
                let mut alts: Vec<Pattern> = children
                    .into_vec()
                    .into_iter()
                    .filter_map(|(_, l)| match l {
                        Lowered::Pattern(p) => Some(p),
                        _ => None,
                    })
                    .collect();
                // Single ppath → transparent; multiple → Or
                if alts.len() == 1 {
                    Lowered::Pattern(alts.remove(0))
                } else {
                    Lowered::Pattern(Pattern::new(span, PatternKind::Or(alts.into())))
                }
            }

            CstKind::Rule {
                rule: Rule::Ppath,
                span,
                children,
            } => {
                let mut base = None;
                let mut fields = vec![];
                for (_, l) in children {
                    match l {
                        Lowered::Pattern(p) => base = Some(p),
                        Lowered::LId(s) => fields.push(s),
                        _ => {}
                    }
                }
                let base = base.expect("ppath has apattern base");
                if fields.is_empty() {
                    Lowered::Pattern(base)
                } else {
                    Lowered::Pattern(Pattern::new(
                        span,
                        PatternKind::FieldAccess {
                            base,
                            fields: fields.into(),
                        },
                    ))
                }
            }

            CstKind::Rule {
                rule: Rule::WildcardApattern,
                span,
                ..
            } => Lowered::Pattern(Pattern::new(span, PatternKind::Wildcard)),

            CstKind::Rule {
                rule: Rule::VarApattern,
                span,
                children,
            } => {
                let sym = children
                    .into_iter()
                    .find_map(|(_, l)| match l {
                        Lowered::UId(s) => Some(s),
                        _ => None,
                    })
                    .expect("var apattern has a uid");
                Lowered::Pattern(Pattern::new(span, PatternKind::Variable(sym.node)))
            }
            CstKind::Rule {
                rule: Rule::NatApattern,
                span,
                children,
            } => {
                let n = children
                    .into_iter()
                    .find_map(|(_, l)| match l {
                        Lowered::Nat(n) => Some(n),
                        _ => None,
                    })
                    .expect("nat apattern has a nat");
                Lowered::Pattern(Pattern::new(span, PatternKind::Int(n.node.into())))
            }
            CstKind::Rule {
                rule: Rule::IntApattern,
                span,
                children,
            } => {
                let n = children
                    .into_iter()
                    .find_map(|(_, l)| match l {
                        Lowered::Nat(n) => Some(n),
                        _ => None,
                    })
                    .expect("int apattern has a nat");
                Lowered::Pattern(Pattern::new(span, PatternKind::Int(-(n.node as i64))))
            }

            CstKind::Rule {
                rule: Rule::StringApattern,
                span,
                children,
            } => {
                let s = children
                    .into_iter()
                    .find_map(|(_, l)| match l {
                        Lowered::Str(s) => Some(s),
                        _ => None,
                    })
                    .expect("string apattern has a str");
                Lowered::Pattern(Pattern::new(span, PatternKind::String(s.node)))
            }

            CstKind::Rule {
                rule: Rule::StringPrefixApattern,
                span,
                children,
            } => {
                let s = children
                    .into_iter()
                    .find_map(|(_, l)| match l {
                        Lowered::Str(s) => Some(s),
                        _ => None,
                    })
                    .expect("string prefix apattern has a str");
                Lowered::Pattern(Pattern::new(span, PatternKind::StringPrefix(s.node)))
            }

            CstKind::Rule {
                rule: Rule::BangPattern,
                span,
                children,
            } => {
                let p = children
                    .into_iter()
                    .find_map(|(_, l)| match l {
                        Lowered::Pattern(p) => Some(p),
                        _ => None,
                    })
                    .expect("bang-apattern has a pattern");
                Lowered::Pattern(Pattern::new(span, PatternKind::Not(p)))
            }

            CstKind::Rule {
                rule: Rule::AnonRecordApattern,
                span,
                children,
            } => {
                let fields = children
                    .into_iter()
                    .find_map(|(_, l)| match l {
                        Lowered::FieldList(fl) => Some(fl),
                        _ => None,
                    })
                    .unwrap_or_default();
                Lowered::Pattern(Pattern::new(span, PatternKind::Record(fields)))
            }

            CstKind::Rule {
                rule: Rule::FactApattern,
                span,
                children,
            } => {
                let fact = children
                    .into_iter()
                    .find_map(|(_, l)| match l {
                        Lowered::IntermediateFact { predicate, fields } => {
                            Some((predicate, fields))
                        }
                        _ => None,
                    })
                    .expect("fact apattern has an intermediate fact");
                Lowered::Pattern(Pattern::new(
                    span,
                    PatternKind::Fact {
                        predicate: fact.0,
                        fields: fact.1,
                    },
                ))
            }

            CstKind::Rule {
                rule: Rule::SubqueryApattern,
                span,
                children,
            } => {
                let q = children
                    .into_iter()
                    .find_map(|(_, l)| match l {
                        Lowered::Query(q) => Some(q),
                        _ => None,
                    })
                    .expect("subquery apattern has a query");
                Lowered::Pattern(Pattern::new(span, PatternKind::Subquery(Arc::new(q))))
            }

            CstKind::Rule {
                rule: Rule::FactPattern,
                children,
                ..
            } => {
                let mut namespace = vec![];
                let mut name = None;
                let mut fields = vec![];
                for (_, l) in children {
                    match l {
                        Lowered::LId(s) => namespace.push(s),
                        Lowered::UId(s) => name = Some(s),
                        Lowered::FieldList(f) => fields = f.into_vec(),
                        _ => {}
                    }
                }
                let name = name.expect("fact apattern has a name");
                Lowered::IntermediateFact {
                    predicate: Arc::new(Predicate {
                        namespace: namespace.into(),
                        name,
                    }),
                    fields: fields.into(),
                }
            }

            CstKind::Rule {
                rule: Rule::FieldList,
                children,
                ..
            } => Lowered::FieldList(
                children
                    .into_iter()
                    .filter_map(|(_, l)| match l {
                        Lowered::Field(f) => Some(f),
                        _ => None,
                    })
                    .collect::<Vec<_>>()
                    .into(),
            ),

            CstKind::Rule {
                rule: Rule::Field,
                span,
                children,
            } => {
                let mut name = None;
                let mut value = None;
                for (_, l) in children {
                    match l {
                        Lowered::LId(s) => name = Some(s),
                        Lowered::Pattern(p) => value = Some(p),
                        _ => {}
                    }
                }
                Lowered::Field(Spanned::new(
                    span,
                    Field {
                        name: name.unwrap(),
                        value: value.unwrap(),
                    },
                ))
            }
            CstKind::Rule {
                rule: Rule::Filter,
                span,
                children,
            } => {
                let mut alts: Vec<Filter> = children
                    .into_iter()
                    .filter_map(|(_, l)| match l {
                        Lowered::Filter(f) => Some(f),
                        _ => None,
                    })
                    .collect();

                if alts.len() == 1 {
                    Lowered::Filter(alts.remove(0))
                } else {
                    Lowered::Filter(Filter::new(span, FilterKind::Or(alts.into())))
                }
            }

            CstKind::Rule {
                rule: Rule::FilterConj,
                span,
                children,
            } => {
                let mut parts: Vec<Filter> = children
                    .into_iter()
                    .filter_map(|(_, l)| match l {
                        Lowered::Filter(f) => Some(f),
                        _ => None,
                    })
                    .collect();
                if parts.len() == 1 {
                    Lowered::Filter(parts.remove(0))
                } else {
                    Lowered::Filter(Filter::new(span, FilterKind::And(parts.into())))
                }
            }

            CstKind::Rule {
                rule: Rule::CmpFilter,
                span,
                children,
            } => {
                let mut exprs = vec![];
                let mut op = None;
                for (_, l) in children {
                    match l {
                        Lowered::Expr(e) => exprs.push(e),
                        Lowered::CmpOp(o) => op = Some(o),
                        _ => {}
                    }
                }
                let op = op.expect("cmp filter has an operator");
                Lowered::Filter(Filter::new(
                    span,
                    FilterKind::Cmp {
                        op: op.node,
                        left: Box::new(exprs.remove(0)),
                        right: Box::new(exprs.remove(0)),
                    },
                ))
            }

            CstKind::Rule {
                rule: Rule::BangFilter,
                span,
                children,
            } => {
                let f = children
                    .into_iter()
                    .find_map(|(_, l)| match l {
                        Lowered::Filter(f) => Some(f),
                        _ => None,
                    })
                    .expect("bang filter has a filter");
                Lowered::Filter(Filter::new(span, FilterKind::Not(f)))
            }
            CstKind::Rule {
                rule: Rule::Cmp,
                children,
                ..
            } => children
                .into_iter()
                .find_map(|(_, l)| match l {
                    Lowered::CmpOp(o) => Some(Lowered::CmpOp(o)),
                    _ => None,
                })
                .expect("cmp has an operator"),
            CstKind::Rule {
                rule: Rule::Expr,
                children,
                ..
            } => {
                let children = children;
                let mut exprs: Vec<Expr> = vec![];
                let mut ops: Vec<ArithOp> = vec![];
                for (_, l) in children {
                    match l {
                        Lowered::Expr(e) => exprs.push(e),
                        Lowered::ArithOp(op) => ops.push(op.node),
                        _ => {}
                    }
                }
                let expr = exprs
                    .into_iter()
                    .enumerate()
                    .reduce(|(_, acc), (i, rhs)| {
                        let op = ops[i - 1];
                        let span = acc.span.start..rhs.span.end;
                        (
                            i,
                            Expr::new(
                                span,
                                ExprKind::BinaryOp {
                                    op,
                                    left: acc,
                                    right: rhs,
                                },
                            ),
                        )
                    })
                    .map(|(_, e)| e)
                    .expect("expr has an expression");
                Lowered::Expr(expr)
            }

            CstKind::Rule {
                rule: Rule::NegateExpr,
                span,
                children,
            } => {
                let e = children
                    .into_iter()
                    .find_map(|(_, l)| match l {
                        Lowered::Expr(e) => Some(e),
                        _ => None,
                    })
                    .expect("negate expr has an expression");
                Lowered::Expr(Expr::new(span, ExprKind::Negate(e)))
            }

            CstKind::Rule {
                rule: Rule::VarExpr,
                span,
                children,
            } => {
                let mut name = None;
                let mut fields = vec![];
                for (_, l) in children {
                    match l {
                        Lowered::UId(s) => name = Some(s),
                        Lowered::LId(s) => fields.push(s),
                        _ => {} // '.' → Trivia
                    }
                }
                let name = name.expect("fact apattern has a name");
                Lowered::Expr(Expr::new(
                    span,
                    ExprKind::Variable {
                        name: name.node,
                        fields: fields.into(),
                    },
                ))
            }

            CstKind::Rule {
                rule: Rule::NatExpr,
                span,
                children,
            } => {
                let n = children
                    .into_iter()
                    .find_map(|(_, l)| match l {
                        Lowered::Nat(n) => Some(n),
                        _ => None,
                    })
                    .expect("nat expr has a nat");
                Lowered::Expr(Expr::new(span, ExprKind::Int(n.node.into())))
            }

            CstKind::Rule {
                rule: Rule::StringExpr,
                span,
                children,
            } => {
                let s = children
                    .into_iter()
                    .find_map(|(_, l)| match l {
                        Lowered::Str(s) => Some(s),
                        _ => None,
                    })
                    .expect("string expr has a string");
                Lowered::Expr(Expr::new(span, ExprKind::String(s.node)))
            }

            CstKind::Rule {
                rule: Rule::GroupExpr,
                children,
                ..
            } => children
                .into_iter()
                .find_map(|(_, l)| match l {
                    Lowered::Expr(e) => Some(Lowered::Expr(e)),
                    _ => None,
                })
                .expect("group expr has an expression"),
            CstKind::Token {
                token: Token::UId,
                text,
                span,
            } => Lowered::UId(Spanned::new(span, self.intern(text))),
            CstKind::Token {
                token: Token::LId,
                text,
                span,
            } => Lowered::LId(Spanned::new(span, self.intern(text))),
            CstKind::Token {
                token: Token::Nat,
                text,
                span,
            } => Lowered::Nat(Spanned::new(span, text.parse().unwrap())),
            CstKind::Token {
                token: Token::String,
                text,
                span,
            } => Lowered::Str(Spanned::new(span, self.intern(text))),

            CstKind::Token {
                token: Token::EqEq,
                span,
                ..
            } => Lowered::CmpOp(Spanned::new(span, CmpOp::Eq)),
            CstKind::Token {
                token: Token::Neq,
                span,
                ..
            } => Lowered::CmpOp(Spanned::new(span, CmpOp::Neq)),
            CstKind::Token {
                token: Token::Lt,
                span,
                ..
            } => Lowered::CmpOp(Spanned::new(span, CmpOp::Lt)),
            CstKind::Token {
                token: Token::Gt,
                span,
                ..
            } => Lowered::CmpOp(Spanned::new(span, CmpOp::Gt)),
            CstKind::Token {
                token: Token::Lte,
                span,
                ..
            } => Lowered::CmpOp(Spanned::new(span, CmpOp::Lte)),
            CstKind::Token {
                token: Token::Gte,
                span,
                ..
            } => Lowered::CmpOp(Spanned::new(span, CmpOp::Gte)),

            CstKind::Token {
                token: Token::Plus,
                span,
                ..
            } => Lowered::ArithOp(Spanned::new(span, ArithOp::Plus)),
            CstKind::Token {
                token: Token::Minus,
                span,
                ..
            } => Lowered::ArithOp(Spanned::new(span, ArithOp::Minus)),
            CstKind::Rule { .. } | CstKind::Token { .. } => Lowered::Trivia,
        }
    }
}
