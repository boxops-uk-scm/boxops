use crate::syntax::family::NodeTypeFamily;
use crate::syntax::kind::{KindQuery, KindSubqueryPattern};
use crate::syntax::node::SyntaxNode;
use crate::syntax::view::SyntaxKind;

use super::PatternSyntax;

pub struct SubqueryPatternSyntax<'s, F: NodeTypeFamily<'s>> {
    pub query: F::NodeType<KindQuery>,
}

impl<'s> SyntaxNode<'s, KindSubqueryPattern> {
    pub fn query(&self) -> SyntaxNode<'s, KindQuery> {
        let SyntaxKind::Pattern(PatternSyntax::Subquery(sq)) = self.erase().kind_typed() else {
            unreachable!()
        };
        sq.query
    }
}
