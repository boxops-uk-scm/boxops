use crate::syntax::kind::KindStringPattern;
use crate::syntax::node::SyntaxNode;
use crate::syntax::view::SyntaxKind;

use super::PatternSyntax;

pub struct StringPatternSyntax<'s> {
    /// String content without surrounding quotes.
    pub value: &'s str,
}

impl<'s> SyntaxNode<'s, KindStringPattern> {
    pub fn value(&self) -> &'s str {
        let SyntaxKind::Pattern(PatternSyntax::String(s)) = self.erase().kind_typed() else {
            unreachable!()
        };
        s.value
    }
}
