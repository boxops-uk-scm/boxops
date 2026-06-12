use crate::syntax::family::NodeTypeFamily;
use crate::syntax::kind::{KindBangPattern, KindPattern};
use crate::syntax::node::SyntaxNode;
use crate::syntax::view::SyntaxKind;

use super::PatternSyntax;

pub struct BangPatternSyntax<'s, F: NodeTypeFamily<'s>> {
    pub inner: F::NodeType<KindPattern>,
}

impl<'s> SyntaxNode<'s, KindBangPattern> {
    pub fn inner(&self) -> SyntaxNode<'s, KindPattern> {
        let SyntaxKind::Pattern(PatternSyntax::Bang(b)) = self.erase().kind_typed() else {
            unreachable!()
        };
        b.inner
    }
}
