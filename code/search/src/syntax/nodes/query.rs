use crate::syntax::family::NodeTypeFamily;
use crate::syntax::kind::{KindPattern, KindQuery};
use crate::syntax::node::SyntaxNode;
use crate::syntax::view::SyntaxKind;

pub struct QuerySyntax<'s, F: NodeTypeFamily<'s>> {
    pub head: F::NodeType<KindPattern>,
    pub body: Box<[F::NodeType<KindPattern>]>,
}

impl<'s> SyntaxNode<'s, KindQuery> {
    pub fn head(&self) -> SyntaxNode<'s, KindPattern> {
        let SyntaxKind::Query(query) = self.erase().kind_typed() else {
            unreachable!()
        };

        query.head
    }

    pub fn body(&self) -> Box<[SyntaxNode<'s, KindPattern>]> {
        let SyntaxKind::Query(query) = self.erase().kind_typed() else {
            unreachable!()
        };

        query.body
    }
}
