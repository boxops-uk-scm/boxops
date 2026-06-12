use crate::syntax::family::{NodeTypeFamily, TypedNodes};
use crate::syntax::kind::KindPattern;
use crate::syntax::node::SyntaxNode;
use crate::syntax::view::SyntaxKind;

use super::{
    AnonRecordPatternSyntax, BangPatternSyntax, FactPatternSyntax, FieldAccessPatternSyntax,
    IntegerPatternSyntax, ProductPatternSyntax, StringPatternSyntax, StringPrefixPatternSyntax,
    SubqueryPatternSyntax, VariablePatternSyntax, WildcardPatternSyntax,
};

pub enum PatternSyntax<'s, F: NodeTypeFamily<'s>> {
    /// `ppath '|' ppath ('|' ppath)*` — union of alternatives.
    Product(ProductPatternSyntax<'s, F>),
    /// `UId` — variable or constructor reference.
    Variable(VariablePatternSyntax<'s>),
    /// `apattern ('.' LId)+` — chained field access.
    FieldAccess(FieldAccessPatternSyntax<'s, F>),
    /// `Nat` or `'-' Nat` — integer literal.
    Integer(IntegerPatternSyntax),
    /// `String` — string literal.
    String(StringPatternSyntax<'s>),
    /// `String '..'` — string prefix match.
    StringPrefix(StringPrefixPatternSyntax<'s>),
    /// `'_'` — wildcard (matches anything).
    Wildcard(WildcardPatternSyntax),
    /// `(LId '.')+ UId ['{' fields '}']` — fact/constructor pattern.
    Fact(FactPatternSyntax<'s, F>),
    /// `'{' [fields] '}'` — anonymous record pattern.
    AnonRecord(AnonRecordPatternSyntax<'s, F>),
    /// `'(' query ')'` — nested subquery.
    Subquery(SubqueryPatternSyntax<'s, F>),
    /// `'!' apattern` — negation pattern.
    Bang(BangPatternSyntax<'s, F>),
}

impl<'s> SyntaxNode<'s, KindPattern> {
    pub fn pattern_kind(&self) -> PatternSyntax<'s, TypedNodes<'s>> {
        let SyntaxKind::Pattern(p) = self.erase().kind_typed() else {
            unreachable!()
        };

        p
    }
}
