use std::fmt;

use crate::parser::{Cst, NodeRef};
use crate::syntax::KindToken;

use super::family::{ConstNodes, EraseNodeTypeMap, ErasedNodes};
use super::kind::{Kind, KindAny, KindRoot};
use super::view::SyntaxKind;

#[derive(Clone, Copy)]
pub struct SyntaxNode<'s, K: Kind = KindAny> {
    pub(crate) cst: &'s Cst<'s>,
    pub(crate) node_ref: NodeRef,
    _marker: std::marker::PhantomData<K>,
}

impl<'s, K: Kind> fmt::Debug for SyntaxNode<'s, K> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let mut debug = f.debug_struct(K::NAME);

        match self.cst.get(self.node_ref) {
            crate::parser::Node::Rule(rule, _) => {
                debug.field("rule", &rule);
            }
            crate::parser::Node::Token(token, _) => {
                debug.field("token", &token);
            }
        }

        debug
            .field("span", &self.span())
            .field("text", &self.text())
            .finish()
    }
}

impl<'s, K: Kind> SyntaxNode<'s, K> {
    pub(crate) fn from_raw(cst: &'s Cst<'s>, node_ref: NodeRef) -> Self {
        Self {
            cst,
            node_ref,
            _marker: std::marker::PhantomData,
        }
    }

    pub fn span(&self) -> std::ops::Range<usize> {
        self.cst.span(self.node_ref).into()
    }

    pub fn text(&self) -> &'s str {
        self.cst.source()[self.span()].into()
    }

    pub fn erase(self) -> SyntaxNode<'s, KindAny> {
        SyntaxNode::from_raw(self.cst, self.node_ref)
    }

    pub fn kind_any(&self) -> SyntaxKind<'s, ErasedNodes<'s>> {
        self.kind_typed().hoist(&EraseNodeTypeMap)
    }

    pub(crate) fn children(&self) -> impl Iterator<Item = SyntaxNode<'s, KindAny>> {
        self.cst
            .children(self.node_ref)
            .map(|node_ref| SyntaxNode::from_raw(self.cst, node_ref))
            .filter(|n| {
                n.cast::<KindToken>()
                    .map(|t| t.token() != crate::lexer::Token::Whitespace)
                    .unwrap_or(true)
            })
    }
}

impl<'s> SyntaxNode<'s, KindAny> {
    pub fn root(cst: &'s Cst<'s>) -> SyntaxNode<'s, KindRoot> {
        SyntaxNode::from_raw(cst, NodeRef::ROOT)
    }

    pub fn cast<K: Kind>(self) -> Option<SyntaxNode<'s, K>> {
        if K::is(self.cst, self.node_ref) {
            Some(SyntaxNode::from_raw(self.cst, self.node_ref))
        } else {
            None
        }
    }

    pub fn reduce<A: 's>(&self, alg: &impl Fn(SyntaxKind<'s, ConstNodes<A>>) -> A) -> A {
        alg(self.kind_any().map(|child| child.reduce(alg)))
    }
}

impl<'s> SyntaxNode<'s, KindToken> {
    pub fn token(&self) -> crate::lexer::Token {
        let SyntaxKind::Token { token, .. } = self.kind_any() else {
            unreachable!()
        };

        token
    }
}
