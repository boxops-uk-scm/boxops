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
        matches!(
            cst.get(node_ref),
            crate::parser::Node::Rule(crate::parser::Rule::Pattern, _)
        )
    }
}

#[derive(Debug, Clone, Copy)]
pub struct KindProductPattern;

impl Kind for KindProductPattern {
    const NAME: &'static str = "ProductPattern";

    fn is(_cst: &Cst<'_>, _node_ref: NodeRef) -> bool {
        todo!()
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
