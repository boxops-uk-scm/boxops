use super::super::family::NodeTypeFamily;
use super::super::kind::{KindQuery, KindRoot};
use super::super::node::SyntaxNode;
use super::super::view::SyntaxKind;

pub struct RootSyntax<'s, F: NodeTypeFamily<'s>> {
    pub query: F::NodeType<KindQuery>,
}

impl<'s> SyntaxNode<'s, KindRoot> {
    pub fn query(&self) -> SyntaxNode<'s, KindQuery> {
        let SyntaxKind::Root(root) = self.erase().kind_typed() else {
            unreachable!()
        };

        root.query
    }
}
