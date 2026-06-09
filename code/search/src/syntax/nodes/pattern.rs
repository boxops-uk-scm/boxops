use crate::syntax::family::{NodeTypeFamily, TypedNodes};
use crate::syntax::kind::KindPattern;
use crate::syntax::node::SyntaxNode;
use crate::syntax::view::SyntaxKind;

use super::{ProductPatternSyntax, VariablePatternSyntax};

pub enum PatternSyntax<'s, F: NodeTypeFamily<'s>> {
    Product(ProductPatternSyntax<'s, F>),
    Variable(VariablePatternSyntax<'s>),
}

impl<'s> SyntaxNode<'s, KindPattern> {
    pub fn pattern_kind(&self) -> PatternSyntax<'s, TypedNodes<'s>> {
        let SyntaxKind::Pattern(p) = self.erase().kind_typed() else {
            unreachable!()
        };

        p
    }
}
