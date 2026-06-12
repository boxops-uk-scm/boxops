use crate::syntax::{KindAny, KindRule, KindToken};

use super::family::{ConstNodeTypeMap, ConstNodes, ErasedNodes, NodeTypeFamily, NodeTypeMap};
use super::node::SyntaxNode;
use super::nodes::{
    AnonRecordPatternSyntax, BangPatternSyntax, FactPatternSyntax, FieldAccessPatternSyntax,
    FieldSyntax, IntegerPatternSyntax, PatternSyntax, ProductPatternSyntax, QuerySyntax,
    RootSyntax, StringPatternSyntax, StringPrefixPatternSyntax, SubqueryPatternSyntax,
    VariablePatternSyntax, WildcardPatternSyntax,
};

pub enum SyntaxKind<'s, F: NodeTypeFamily<'s>> {
    Root(RootSyntax<'s, F>),
    Query(QuerySyntax<'s, F>),
    Pattern(PatternSyntax<'s, F>),
    Rule {
        rule: crate::parser::Rule,
        node: F::NodeType<KindRule>,
    },
    Token {
        token: crate::lexer::Token,
        node: F::NodeType<KindToken>,
    },
}

impl<'s, From: NodeTypeFamily<'s>> SyntaxKind<'s, From> {
    pub fn hoist<To: NodeTypeFamily<'s>>(
        self,
        f: &impl NodeTypeMap<'s, From, To>,
    ) -> SyntaxKind<'s, To> {
        match self {
            SyntaxKind::Root(r) => SyntaxKind::Root(RootSyntax {
                query: f.type_map(r.query),
            }),

            SyntaxKind::Query(q) => SyntaxKind::Query(QuerySyntax {
                head: f.type_map(q.head),
                body: q
                    .body
                    .into_iter()
                    .map(|n| f.type_map(n))
                    .collect::<Vec<_>>()
                    .into_boxed_slice(),
            }),

            SyntaxKind::Pattern(p) => SyntaxKind::Pattern(hoist_pattern(p, f)),

            SyntaxKind::Rule { rule, node } => SyntaxKind::Rule {
                rule,
                node: f.type_map(node),
            },

            SyntaxKind::Token { token, node } => SyntaxKind::Token {
                token,
                node: f.type_map(node),
            },
        }
    }
}

fn hoist_pattern<'s, From: NodeTypeFamily<'s>, To: NodeTypeFamily<'s>>(
    p: PatternSyntax<'s, From>,
    f: &impl NodeTypeMap<'s, From, To>,
) -> PatternSyntax<'s, To> {
    match p {
        PatternSyntax::Product(product) => PatternSyntax::Product(ProductPatternSyntax {
            alternatives: product
                .alternatives
                .into_iter()
                .map(|n| f.type_map(n))
                .collect::<Vec<_>>()
                .into_boxed_slice(),
        }),

        PatternSyntax::Variable(v) => PatternSyntax::Variable(VariablePatternSyntax {
            name: v.name,
        }),

        PatternSyntax::FieldAccess(fa) => PatternSyntax::FieldAccess(FieldAccessPatternSyntax {
            base: f.type_map(fa.base),
            fields: fa.fields,
        }),

        PatternSyntax::Integer(i) => PatternSyntax::Integer(IntegerPatternSyntax {
            value: i.value,
        }),

        PatternSyntax::String(s) => PatternSyntax::String(StringPatternSyntax { value: s.value }),

        PatternSyntax::StringPrefix(sp) => {
            PatternSyntax::StringPrefix(StringPrefixPatternSyntax { prefix: sp.prefix })
        }

        PatternSyntax::Wildcard(_) => PatternSyntax::Wildcard(WildcardPatternSyntax),

        PatternSyntax::Fact(fact) => PatternSyntax::Fact(FactPatternSyntax {
            path: fact.path,
            name: fact.name,
            fields: fact
                .fields
                .into_iter()
                .map(|field| FieldSyntax {
                    name: field.name,
                    value: f.type_map(field.value),
                })
                .collect::<Vec<_>>()
                .into_boxed_slice(),
        }),

        PatternSyntax::AnonRecord(ar) => PatternSyntax::AnonRecord(AnonRecordPatternSyntax {
            fields: ar
                .fields
                .into_iter()
                .map(|field| FieldSyntax {
                    name: field.name,
                    value: f.type_map(field.value),
                })
                .collect::<Vec<_>>()
                .into_boxed_slice(),
        }),

        PatternSyntax::Subquery(sq) => PatternSyntax::Subquery(SubqueryPatternSyntax {
            query: f.type_map(sq.query),
        }),

        PatternSyntax::Bang(b) => PatternSyntax::Bang(BangPatternSyntax {
            inner: f.type_map(b.inner),
        }),
    }
}

impl<'s> SyntaxKind<'s, ErasedNodes<'s>> {
    pub fn map<A: 's>(
        self,
        f: impl Fn(SyntaxNode<'s, KindAny>) -> A,
    ) -> SyntaxKind<'s, ConstNodes<A>> {
        self.hoist(&ConstNodeTypeMap(f))
    }
}

impl<'s, T: 's> SyntaxKind<'s, ConstNodes<T>> {
    pub fn map<U: 's>(self, f: impl Fn(T) -> U) -> SyntaxKind<'s, ConstNodes<U>> {
        self.hoist(&ConstNodeTypeMap(f))
    }
}
