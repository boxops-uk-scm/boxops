use crate::syntax::family::NodeTypeFamily;
use crate::syntax::kind::{KindFieldAccessPattern, KindPattern};
use crate::syntax::node::SyntaxNode;
use crate::syntax::view::SyntaxKind;

use super::PatternSyntax;

pub struct FieldAccessPatternSyntax<'s, F: NodeTypeFamily<'s>> {
    /// The base apattern being accessed into.
    pub base: F::NodeType<KindPattern>,
    /// The chain of field names following the base (at least one).
    pub fields: Box<[&'s str]>,
}

impl<'s> SyntaxNode<'s, KindFieldAccessPattern> {
    pub fn base(&self) -> SyntaxNode<'s, KindPattern> {
        let SyntaxKind::Pattern(PatternSyntax::FieldAccess(fa)) = self.erase().kind_typed() else {
            unreachable!()
        };
        fa.base
    }

    pub fn fields(&self) -> Box<[&'s str]> {
        let SyntaxKind::Pattern(PatternSyntax::FieldAccess(fa)) = self.erase().kind_typed() else {
            unreachable!()
        };
        fa.fields
    }
}

impl<'s, F: NodeTypeFamily<'s>> FieldAccessPatternSyntax<'s, F> {
    pub fn field_count(&self) -> usize {
        self.fields.len()
    }
}

/// Applies a chain of field accesses to a base expression text, e.g. `base.foo.bar`.
pub struct FieldChain<'s> {
    pub base_text: &'s str,
    pub fields: Box<[&'s str]>,
}

impl<'s> FieldChain<'s> {
    pub fn from_field_access(
        node: &SyntaxNode<'s, KindFieldAccessPattern>,
    ) -> FieldChain<'s> {
        let SyntaxKind::Pattern(PatternSyntax::FieldAccess(fa)) = node.erase().kind_typed() else {
            unreachable!()
        };
        FieldChain {
            base_text: SyntaxNode::<'s, KindPattern>::from_raw(node.cst, fa.base.node_ref).text(),
            fields: fa.fields,
        }
    }
}
