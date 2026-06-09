use crate::syntax::Kind;

use super::kind::KindAny;
use super::node::SyntaxNode;

pub trait NodeTypeFamily<'s> {
    type NodeType<K: Kind>;
}

pub struct ErasedNodes<'s> {
    _marker: std::marker::PhantomData<&'s ()>,
}

impl<'s> NodeTypeFamily<'s> for ErasedNodes<'s> {
    type NodeType<K: Kind> = SyntaxNode<'s, KindAny>;
}

pub struct TypedNodes<'s> {
    _marker: std::marker::PhantomData<&'s ()>,
}

impl<'s> NodeTypeFamily<'s> for TypedNodes<'s> {
    type NodeType<K: Kind> = SyntaxNode<'s, K>;
}

pub struct ConstNodes<T>(std::marker::PhantomData<T>);

impl<'s, T: 's> NodeTypeFamily<'s> for ConstNodes<T> {
    type NodeType<K: Kind> = T;
}

pub trait NodeTypeMap<'s, From: NodeTypeFamily<'s>, To: NodeTypeFamily<'s>> {
    fn type_map<K: Kind>(&self, node: From::NodeType<K>) -> To::NodeType<K>;
}

pub(crate) struct EraseNodeTypeMap;

impl<'s> NodeTypeMap<'s, TypedNodes<'s>, ErasedNodes<'s>> for EraseNodeTypeMap {
    fn type_map<K: Kind>(&self, node: SyntaxNode<'s, K>) -> SyntaxNode<'s, KindAny> {
        node.erase()
    }
}

pub(crate) struct ConstNodeTypeMap<F>(pub(crate) F);

impl<'s, T: 's, U: 's, F: Fn(T) -> U> NodeTypeMap<'s, ConstNodes<T>, ConstNodes<U>>
    for ConstNodeTypeMap<F>
{
    fn type_map<K: Kind>(&self, node: T) -> U {
        (self.0)(node)
    }
}

impl<'s, T: 's, F: Fn(SyntaxNode<'s, KindAny>) -> T> NodeTypeMap<'s, ErasedNodes<'s>, ConstNodes<T>>
    for ConstNodeTypeMap<F>
{
    fn type_map<K: Kind>(&self, node: SyntaxNode<'s, KindAny>) -> T {
        (self.0)(node)
    }
}
