use crate::syntax::family::{NodeTypeFamily, TypedNodes};
use crate::syntax::kind::KindAnonRecordPattern;
use crate::syntax::node::SyntaxNode;
use crate::syntax::view::SyntaxKind;

use super::{FieldSyntax, PatternSyntax};

pub struct AnonRecordPatternSyntax<'s, F: NodeTypeFamily<'s>> {
    pub fields: Box<[FieldSyntax<'s, F>]>,
}

impl<'s> SyntaxNode<'s, KindAnonRecordPattern> {
    pub fn fields(&self) -> Box<[FieldSyntax<'s, TypedNodes<'s>>]> {
        let SyntaxKind::Pattern(PatternSyntax::AnonRecord(ar)) = self.erase().kind_typed() else {
            unreachable!()
        };
        ar.fields
    }
}
