use crate::syntax::kind::KindWildcardPattern;
use crate::syntax::node::SyntaxNode;
use crate::syntax::view::SyntaxKind;

use super::PatternSyntax;

pub struct WildcardPatternSyntax;

impl<'s> SyntaxNode<'s, KindWildcardPattern> {
    pub fn pattern_kind(&self) -> PatternSyntax<'s, crate::syntax::family::TypedNodes<'s>> {
        let SyntaxKind::Pattern(p) = self.erase().kind_typed() else {
            unreachable!()
        };
        p
    }
}
