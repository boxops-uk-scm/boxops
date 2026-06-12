use crate::syntax::family::{NodeTypeFamily, TypedNodes};
use crate::syntax::kind::KindFactPattern;
use crate::syntax::node::SyntaxNode;
use crate::syntax::view::SyntaxKind;

use super::{FieldSyntax, PatternSyntax};

pub struct FactPatternSyntax<'s, F: NodeTypeFamily<'s>> {
    /// Module path segments: the `(LId '.')+` part before the constructor.
    pub path: Box<[&'s str]>,
    /// Constructor name: the `UId` part.
    pub name: &'s str,
    /// Optional record fields `{ field, ... }`.
    pub fields: Box<[FieldSyntax<'s, F>]>,
}

impl<'s> SyntaxNode<'s, KindFactPattern> {
    pub fn path(&self) -> Box<[&'s str]> {
        let SyntaxKind::Pattern(PatternSyntax::Fact(fact)) = self.erase().kind_typed() else {
            unreachable!()
        };
        fact.path
    }

    pub fn name(&self) -> &'s str {
        let SyntaxKind::Pattern(PatternSyntax::Fact(fact)) = self.erase().kind_typed() else {
            unreachable!()
        };
        fact.name
    }

    pub fn fields(&self) -> Box<[FieldSyntax<'s, TypedNodes<'s>>]> {
        let SyntaxKind::Pattern(PatternSyntax::Fact(fact)) = self.erase().kind_typed() else {
            unreachable!()
        };
        fact.fields
    }
}
