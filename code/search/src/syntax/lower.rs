use crate::parser::{Node, Rule};
use crate::syntax::{Kind, KindPattern, KindToken, QuerySyntax};

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
            Node::Rule(Rule::Query, _) => {
                let children = self.children().collect::<Vec<_>>();

                match children.as_slice() {
                    [head, where_keyword, _body] => {
                        let Some(head_pattern) = head.cast::<KindPattern>() else {
                            panic!("expected pattern node as first child of query node");
                        };

                        let Some(where_keyword) = where_keyword.cast::<KindToken>() else {
                            panic!("expected token node as second child of query node");
                        };

                        assert!(
                            matches!(where_keyword.token(), crate::lexer::Token::Where),
                            "expected 'where' keyword as second child of query node"
                        );

                        SyntaxKind::Query(QuerySyntax {
                            head: head_pattern,
                            body: vec![].into_boxed_slice(),
                        })
                    }
                    _ => panic!(
                        "unexpected number of children for query node: expected 3, got {}",
                        children.len()
                    ),
                }
            }
            Node::Rule(rule, _) => SyntaxKind::Rule {
                rule,
                node: SyntaxNode::from_raw(self.cst, self.node_ref),
            },
            Node::Token(token, _) => SyntaxKind::Token {
                token,
                node: SyntaxNode::from_raw(self.cst, self.node_ref),
            },
        }
    }
}
