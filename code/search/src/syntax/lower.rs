use crate::parser::{Node, Rule};
use crate::syntax::{Kind, QuerySyntax};

use super::family::TypedNodes;
use super::kind;
use super::node::SyntaxNode;
use super::nodes::RootSyntax;
use super::view::SyntaxKind;

use itertools::Itertools;

impl<'s, K: Kind> SyntaxNode<'s, K> {
    pub fn kind_typed(&self) -> SyntaxKind<'s, TypedNodes<'s>> {
        match self.cst.get(self.node_ref) {
            Node::Rule(Rule::Compilation, _) => {
                let query = self
                    .children()
                    .filter_map(|n| n.cast::<kind::KindQuery>())
                    .exactly_one()
                    .unwrap_or_else(|_| panic!("expected exactly one query node in children"));

                SyntaxKind::Root(RootSyntax { query })
            }
            _ => unimplemented!(),
        }
    }
}
