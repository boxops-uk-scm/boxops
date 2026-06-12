use crate::syntax::kind::{KindIntegerPattern, KindNatPattern};
use crate::syntax::node::SyntaxNode;
use crate::syntax::view::SyntaxKind;

use super::PatternSyntax;

pub struct IntegerPatternSyntax {
    pub value: i64,
}

impl<'s> SyntaxNode<'s, KindNatPattern> {
    pub fn value(&self) -> i64 {
        let SyntaxKind::Pattern(PatternSyntax::Integer(int)) = self.erase().kind_typed() else {
            unreachable!()
        };
        int.value
    }
}

impl<'s> SyntaxNode<'s, KindIntegerPattern> {
    pub fn value(&self) -> i64 {
        let SyntaxKind::Pattern(PatternSyntax::Integer(int)) = self.erase().kind_typed() else {
            unreachable!()
        };
        int.value
    }
}
