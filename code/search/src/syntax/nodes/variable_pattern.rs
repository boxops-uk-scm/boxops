use crate::syntax::kind::KindVariablePattern;
use crate::syntax::node::SyntaxNode;
use crate::syntax::view::SyntaxKind;

use super::PatternSyntax;

pub struct VariablePatternSyntax<'s> {
    pub name: &'s str,
}

impl<'s> SyntaxNode<'s, KindVariablePattern> {
    pub fn name(&self) -> &'s str {
        let SyntaxKind::Pattern(PatternSyntax::Variable(variable)) = self.erase().kind_typed()
        else {
            unreachable!()
        };

        variable.name
    }
}
