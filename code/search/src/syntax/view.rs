use crate::syntax::{KindAny, KindRule};

use super::family::{ConstNodeTypeMap, ConstNodes, ErasedNodes, NodeTypeFamily, NodeTypeMap};
use super::node::SyntaxNode;
use super::nodes::{
    PatternSyntax, ProductPatternSyntax, QuerySyntax, RootSyntax, VariablePatternSyntax,
};

pub enum SyntaxKind<'s, F: NodeTypeFamily<'s>> {
    Root(RootSyntax<'s, F>),
    Query(QuerySyntax<'s, F>),
    Pattern(PatternSyntax<'s, F>),
    Rule(F::NodeType<KindRule>),
    Token(F::NodeType<KindAny>),
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

            SyntaxKind::Pattern(p) => SyntaxKind::Pattern(match p {
                PatternSyntax::Product(product) => PatternSyntax::Product(ProductPatternSyntax {
                    alternatives: product
                        .alternatives
                        .into_iter()
                        .map(|n| f.type_map(n))
                        .collect::<Vec<_>>()
                        .into_boxed_slice(),
                }),

                PatternSyntax::Variable(variable) => {
                    PatternSyntax::Variable(VariablePatternSyntax {
                        name: variable.name,
                    })
                }
            }),

            SyntaxKind::Rule(r) => SyntaxKind::Rule(f.type_map(r)),

            SyntaxKind::Token(t) => SyntaxKind::Token(f.type_map(t)),
        }
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
