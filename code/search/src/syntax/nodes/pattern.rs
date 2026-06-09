use crate::syntax::family::{NodeTypeFamily, TypedNodes};
use crate::syntax::kind::KindPattern;
use crate::syntax::node::SyntaxNode;
use crate::syntax::view::SyntaxKind;

use super::{ProductPatternSyntax, VariablePatternSyntax};

pub enum PatternSyntax<'s, F: NodeTypeFamily<'s>> {
    Product(ProductPatternSyntax<'s, F>),
    Variable(VariablePatternSyntax<'s>),
    FieldAccess(FieldAccessPatternSyntax<'s, F>),
    Integer(IntegerPatternSyntax<'s, F>),
    String(StringPatternSyntax<'s, F>),
    StringPrefix(StringPrefixPatternSyntax<'s, F>),
    Wildcard(WildcardPatternSyntax<'s, F>),
    Fact(FactPatternSyntax<'s, F>),
    AnonRecord(AnonRecordPatternSyntax<'s, F>),
    Subquery(SubqueryPatternSyntax<'s, F>),
}

impl<'s> SyntaxNode<'s, KindPattern> {
    pub fn pattern_kind(&self) -> PatternSyntax<'s, TypedNodes<'s>> {
        let SyntaxKind::Pattern(p) = self.erase().kind_typed() else {
            unreachable!()
        };

        p
    }
}
