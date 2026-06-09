use crate::syntax::family::NodeTypeFamily;
use crate::syntax::kind::{KindPattern, KindProductPattern};
use crate::syntax::node::SyntaxNode;
use crate::syntax::view::SyntaxKind;

use super::PatternSyntax;

pub struct ProductPatternSyntax<'s, F: NodeTypeFamily<'s>> {
    pub alternatives: Box<[F::NodeType<KindPattern>]>,
}

impl<'s> SyntaxNode<'s, KindProductPattern> {
    pub fn alternatives(&self) -> Box<[SyntaxNode<'s, KindPattern>]> {
        let SyntaxKind::Pattern(PatternSyntax::Product(product)) = self.erase().kind_typed() else {
            unreachable!()
        };

        product.alternatives
    }
}
