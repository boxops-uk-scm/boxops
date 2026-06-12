use crate::syntax::kind::KindStringPrefixPattern;
use crate::syntax::node::SyntaxNode;
use crate::syntax::view::SyntaxKind;

use super::PatternSyntax;

pub struct StringPrefixPatternSyntax<'s> {
    /// Prefix content without surrounding quotes.
    pub prefix: &'s str,
}

impl<'s> SyntaxNode<'s, KindStringPrefixPattern> {
    pub fn prefix(&self) -> &'s str {
        let SyntaxKind::Pattern(PatternSyntax::StringPrefix(s)) = self.erase().kind_typed() else {
            unreachable!()
        };
        s.prefix
    }
}
