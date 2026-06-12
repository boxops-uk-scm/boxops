use crate::parser::{Cst, NodeRef};

pub trait Kind {
    const NAME: &'static str;

    fn is(cst: &Cst<'_>, node_ref: NodeRef) -> bool;
}

#[derive(Debug, Clone, Copy)]
pub struct KindAny;

impl Kind for KindAny {
    const NAME: &'static str = "Any";

    fn is(_cst: &Cst<'_>, _node_ref: NodeRef) -> bool {
        true
    }
}

#[derive(Debug, Clone, Copy)]
pub struct KindRoot;

impl Kind for KindRoot {
    const NAME: &'static str = "Root";

    fn is(_cst: &Cst<'_>, node_ref: NodeRef) -> bool {
        node_ref == NodeRef::ROOT
    }
}

#[derive(Debug, Clone, Copy)]
pub struct KindQuery;

impl Kind for KindQuery {
    const NAME: &'static str = "Query";

    fn is(cst: &Cst<'_>, node_ref: NodeRef) -> bool {
        matches!(
            cst.get(node_ref),
            crate::parser::Node::Rule(crate::parser::Rule::Query, _)
        )
    }
}

#[derive(Debug, Clone, Copy)]
pub struct KindRule;

impl Kind for KindRule {
    const NAME: &'static str = "Rule";

    fn is(cst: &Cst<'_>, node_ref: NodeRef) -> bool {
        matches!(cst.get(node_ref), crate::parser::Node::Rule(_, _))
    }
}

#[derive(Debug, Clone, Copy)]
pub struct KindToken;

impl Kind for KindToken {
    const NAME: &'static str = "Token";

    fn is(cst: &Cst<'_>, node_ref: NodeRef) -> bool {
        matches!(cst.get(node_ref), crate::parser::Node::Token(_, _))
    }
}

#[derive(Debug, Clone, Copy)]
pub struct KindPattern;

impl Kind for KindPattern {
    const NAME: &'static str = "Pattern";

    fn is(cst: &Cst<'_>, node_ref: NodeRef) -> bool {
        match cst.get(node_ref) {
            crate::parser::Node::Rule(rule, _) => matches!(
                rule,
                crate::parser::Rule::Pattern
                    | crate::parser::Rule::Ppath
                    | crate::parser::Rule::Apattern
                    | crate::parser::Rule::VarApattern
                    | crate::parser::Rule::IntApattern
                    | crate::parser::Rule::StringApattern
                    | crate::parser::Rule::StringPrefixApattern
                    | crate::parser::Rule::NatApattern
                    | crate::parser::Rule::FactApattern
                    | crate::parser::Rule::SubqueryApattern
                    | crate::parser::Rule::WildcardApattern
                    | crate::parser::Rule::AnonRecordApattern
                    | crate::parser::Rule::BangPattern
            ),
            _ => false,
        }
    }
}

#[derive(Debug, Clone, Copy)]
pub struct KindProductPattern;

impl Kind for KindProductPattern {
    const NAME: &'static str = "ProductPattern";

    fn is(cst: &Cst<'_>, node_ref: NodeRef) -> bool {
        if !matches!(
            cst.get(node_ref),
            crate::parser::Node::Rule(crate::parser::Rule::Pattern, _)
        ) {
            return false;
        }
        cst.children(node_ref)
            .filter(|&c| {
                matches!(
                    cst.get(c),
                    crate::parser::Node::Rule(crate::parser::Rule::Ppath, _)
                )
            })
            .count()
            > 1
    }
}

#[derive(Debug, Clone, Copy)]
pub struct KindVariablePattern;

impl Kind for KindVariablePattern {
    const NAME: &'static str = "VariablePattern";

    fn is(cst: &Cst<'_>, node_ref: NodeRef) -> bool {
        matches!(
            cst.get(node_ref),
            crate::parser::Node::Rule(crate::parser::Rule::VarApattern, _)
        )
    }
}

#[derive(Debug, Clone, Copy)]
pub struct KindFieldAccessPattern;

impl Kind for KindFieldAccessPattern {
    const NAME: &'static str = "FieldAccessPattern";

    fn is(cst: &Cst<'_>, node_ref: NodeRef) -> bool {
        if !matches!(
            cst.get(node_ref),
            crate::parser::Node::Rule(crate::parser::Rule::Ppath, _)
        ) {
            return false;
        }
        cst.children(node_ref).any(|c| {
            matches!(
                cst.get(c),
                crate::parser::Node::Token(crate::lexer::Token::Dot, _)
            )
        })
    }
}

#[derive(Debug, Clone, Copy)]
pub struct KindWildcardPattern;

impl Kind for KindWildcardPattern {
    const NAME: &'static str = "WildcardPattern";

    fn is(cst: &Cst<'_>, node_ref: NodeRef) -> bool {
        matches!(
            cst.get(node_ref),
            crate::parser::Node::Rule(crate::parser::Rule::WildcardApattern, _)
        )
    }
}

#[derive(Debug, Clone, Copy)]
pub struct KindNatPattern;

impl Kind for KindNatPattern {
    const NAME: &'static str = "NatPattern";

    fn is(cst: &Cst<'_>, node_ref: NodeRef) -> bool {
        matches!(
            cst.get(node_ref),
            crate::parser::Node::Rule(crate::parser::Rule::NatApattern, _)
        )
    }
}

#[derive(Debug, Clone, Copy)]
pub struct KindIntegerPattern;

impl Kind for KindIntegerPattern {
    const NAME: &'static str = "IntegerPattern";

    fn is(cst: &Cst<'_>, node_ref: NodeRef) -> bool {
        matches!(
            cst.get(node_ref),
            crate::parser::Node::Rule(crate::parser::Rule::IntApattern, _)
        )
    }
}

#[derive(Debug, Clone, Copy)]
pub struct KindStringPattern;

impl Kind for KindStringPattern {
    const NAME: &'static str = "StringPattern";

    fn is(cst: &Cst<'_>, node_ref: NodeRef) -> bool {
        matches!(
            cst.get(node_ref),
            crate::parser::Node::Rule(crate::parser::Rule::StringApattern, _)
        )
    }
}

#[derive(Debug, Clone, Copy)]
pub struct KindStringPrefixPattern;

impl Kind for KindStringPrefixPattern {
    const NAME: &'static str = "StringPrefixPattern";

    fn is(cst: &Cst<'_>, node_ref: NodeRef) -> bool {
        matches!(
            cst.get(node_ref),
            crate::parser::Node::Rule(crate::parser::Rule::StringPrefixApattern, _)
        )
    }
}

#[derive(Debug, Clone, Copy)]
pub struct KindFactPattern;

impl Kind for KindFactPattern {
    const NAME: &'static str = "FactPattern";

    fn is(cst: &Cst<'_>, node_ref: NodeRef) -> bool {
        matches!(
            cst.get(node_ref),
            crate::parser::Node::Rule(crate::parser::Rule::FactApattern, _)
        )
    }
}

#[derive(Debug, Clone, Copy)]
pub struct KindAnonRecordPattern;

impl Kind for KindAnonRecordPattern {
    const NAME: &'static str = "AnonRecordPattern";

    fn is(cst: &Cst<'_>, node_ref: NodeRef) -> bool {
        matches!(
            cst.get(node_ref),
            crate::parser::Node::Rule(crate::parser::Rule::AnonRecordApattern, _)
        )
    }
}

#[derive(Debug, Clone, Copy)]
pub struct KindSubqueryPattern;

impl Kind for KindSubqueryPattern {
    const NAME: &'static str = "SubqueryPattern";

    fn is(cst: &Cst<'_>, node_ref: NodeRef) -> bool {
        matches!(
            cst.get(node_ref),
            crate::parser::Node::Rule(crate::parser::Rule::SubqueryApattern, _)
        )
    }
}

#[derive(Debug, Clone, Copy)]
pub struct KindBangPattern;

impl Kind for KindBangPattern {
    const NAME: &'static str = "BangPattern";

    fn is(cst: &Cst<'_>, node_ref: NodeRef) -> bool {
        matches!(
            cst.get(node_ref),
            crate::parser::Node::Rule(crate::parser::Rule::BangPattern, _)
        )
    }
}
