use crate::lexer::Token;
use crate::parser::{Node, Rule};
use crate::syntax::{
    AnonRecordPatternSyntax, BangPatternSyntax, FactPatternSyntax, FieldAccessPatternSyntax,
    FieldSyntax, IntegerPatternSyntax, Kind, KindPattern, KindQuery, KindToken, PatternSyntax,
    ProductPatternSyntax, QuerySyntax, StringPatternSyntax, StringPrefixPatternSyntax,
    SubqueryPatternSyntax, VariablePatternSyntax, WildcardPatternSyntax,
};

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

            // pattern: ppath ('|' ppath)*
            // If a single ppath, delegate straight through; multiple → Product.
            Node::Rule(Rule::Pattern, _) => {
                let ppaths: Vec<_> = self
                    .children()
                    .filter(|n| {
                        // Keep rule nodes (ppaths); discard Pipe separator tokens.
                        n.cast::<KindToken>()
                            .map(|t| t.token() != Token::Pipe)
                            .unwrap_or(true)
                    })
                    .collect();

                if ppaths.len() == 1 {
                    ppaths[0].kind_typed()
                } else {
                    SyntaxKind::Pattern(PatternSyntax::Product(ProductPatternSyntax {
                        alternatives: ppaths
                            .into_iter()
                            .map(|n| n.cast::<KindPattern>().expect("ppath must be KindPattern"))
                            .collect::<Vec<_>>()
                            .into_boxed_slice(),
                    }))
                }
            }

            // ppath: apattern ('.' LId)*
            // No dots → delegate to the apattern. With dots → FieldAccess.
            Node::Rule(Rule::Ppath, _) => {
                let children: Vec<_> = self.children().collect();
                let has_dots = children.iter().any(|n| {
                    n.cast::<KindToken>()
                        .map(|t| t.token() == Token::Dot)
                        .unwrap_or(false)
                });

                if !has_dots {
                    children[0].kind_typed()
                } else {
                    let base = children[0]
                        .cast::<KindPattern>()
                        .expect("first child of ppath must be KindPattern");
                    let fields: Box<[&'s str]> = children
                        .iter()
                        .filter(|n| {
                            n.cast::<KindToken>()
                                .map(|t| t.token() == Token::LId)
                                .unwrap_or(false)
                        })
                        .map(|n| n.text())
                        .collect::<Vec<_>>()
                        .into_boxed_slice();
                    SyntaxKind::Pattern(PatternSyntax::FieldAccess(FieldAccessPatternSyntax {
                        base,
                        fields,
                    }))
                }
            }

            // '_' @wildcard_apattern
            Node::Rule(Rule::WildcardApattern, _) => {
                SyntaxKind::Pattern(PatternSyntax::Wildcard(WildcardPatternSyntax))
            }

            // UId @var_apattern
            Node::Rule(Rule::VarApattern, _) => {
                let name = self
                    .children()
                    .find(|n| {
                        n.cast::<KindToken>()
                            .map(|t| t.token() == Token::UId)
                            .unwrap_or(false)
                    })
                    .expect("VarApattern must have UId child")
                    .text();
                SyntaxKind::Pattern(PatternSyntax::Variable(VariablePatternSyntax { name }))
            }

            // Nat @nat_apattern
            Node::Rule(Rule::NatApattern, _) => {
                let text = self
                    .children()
                    .find(|n| {
                        n.cast::<KindToken>()
                            .map(|t| t.token() == Token::Nat)
                            .unwrap_or(false)
                    })
                    .expect("NatApattern must have Nat child")
                    .text();
                let value: i64 = text
                    .replace('_', "")
                    .parse()
                    .expect("NatApattern: valid nat literal");
                SyntaxKind::Pattern(PatternSyntax::Integer(IntegerPatternSyntax { value }))
            }

            // '-' Nat @int_apattern
            Node::Rule(Rule::IntApattern, _) => {
                let text = self
                    .children()
                    .find(|n| {
                        n.cast::<KindToken>()
                            .map(|t| t.token() == Token::Nat)
                            .unwrap_or(false)
                    })
                    .expect("IntApattern must have Nat child")
                    .text();
                let magnitude: i64 = text
                    .replace('_', "")
                    .parse()
                    .expect("IntApattern: valid nat literal");
                SyntaxKind::Pattern(PatternSyntax::Integer(IntegerPatternSyntax {
                    value: -magnitude,
                }))
            }

            // String @string_apattern
            Node::Rule(Rule::StringApattern, _) => {
                let raw = self
                    .children()
                    .find(|n| {
                        n.cast::<KindToken>()
                            .map(|t| t.token() == Token::String)
                            .unwrap_or(false)
                    })
                    .expect("StringApattern must have String child")
                    .text();
                // Strip surrounding double-quotes.
                let value = &raw[1..raw.len() - 1];
                SyntaxKind::Pattern(PatternSyntax::String(StringPatternSyntax { value }))
            }

            // String '..' @string_prefix_apattern
            Node::Rule(Rule::StringPrefixApattern, _) => {
                let raw = self
                    .children()
                    .find(|n| {
                        n.cast::<KindToken>()
                            .map(|t| t.token() == Token::String)
                            .unwrap_or(false)
                    })
                    .expect("StringPrefixApattern must have String child")
                    .text();
                let prefix = &raw[1..raw.len() - 1];
                SyntaxKind::Pattern(PatternSyntax::StringPrefix(StringPrefixPatternSyntax {
                    prefix,
                }))
            }

            // '{' [field_list] '}' @anon_record_apattern
            Node::Rule(Rule::AnonRecordApattern, _) => {
                let fields = self
                    .children()
                    .find(|n| matches!(n.cst.get(n.node_ref), Node::Rule(Rule::FieldList, _)))
                    .map(|fl| lower_field_list(&fl))
                    .unwrap_or_else(|| Box::new([]));
                SyntaxKind::Pattern(PatternSyntax::AnonRecord(AnonRecordPatternSyntax {
                    fields,
                }))
            }

            // fact_pattern @fact_apattern
            // fact_pattern: (LId '.')+ UId ['{' field_list '}']
            Node::Rule(Rule::FactApattern, _) => {
                let fact_node = self
                    .children()
                    .find(|n| matches!(n.cst.get(n.node_ref), Node::Rule(Rule::FactPattern, _)))
                    .expect("FactApattern must have FactPattern child");

                let fact_children: Vec<_> = fact_node.children().collect();

                // Find the UId position; all LIds before it form the module path.
                let uid_idx = fact_children
                    .iter()
                    .position(|n| {
                        n.cast::<KindToken>()
                            .map(|t| t.token() == Token::UId)
                            .unwrap_or(false)
                    })
                    .expect("FactPattern must have UId");

                let path: Box<[&'s str]> = fact_children[..uid_idx]
                    .iter()
                    .filter(|n| {
                        n.cast::<KindToken>()
                            .map(|t| t.token() == Token::LId)
                            .unwrap_or(false)
                    })
                    .map(|n| n.text())
                    .collect::<Vec<_>>()
                    .into_boxed_slice();

                let name = fact_children[uid_idx].text();

                let fields = fact_children[uid_idx + 1..]
                    .iter()
                    .find(|n| matches!(n.cst.get(n.node_ref), Node::Rule(Rule::FieldList, _)))
                    .map(|fl| lower_field_list(fl))
                    .unwrap_or_else(|| Box::new([]));

                SyntaxKind::Pattern(PatternSyntax::Fact(FactPatternSyntax {
                    path,
                    name,
                    fields,
                }))
            }

            // '(' query ')' @subquery_apattern
            Node::Rule(Rule::SubqueryApattern, _) => {
                let query = self
                    .children()
                    .find(|n| n.cast::<KindQuery>().is_some())
                    .expect("SubqueryApattern must have Query child")
                    .cast::<KindQuery>()
                    .unwrap();
                SyntaxKind::Pattern(PatternSyntax::Subquery(SubqueryPatternSyntax { query }))
            }

            // '!' apattern @bang_pattern
            Node::Rule(Rule::BangPattern, _) => {
                let inner = self
                    .children()
                    .find(|n| n.cast::<KindPattern>().is_some())
                    .expect("BangPattern must have pattern child")
                    .cast::<KindPattern>()
                    .unwrap();
                SyntaxKind::Pattern(PatternSyntax::Bang(BangPatternSyntax { inner }))
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

/// Lowers a `FieldList` CST node into a boxed slice of `FieldSyntax`.
///
/// `field: LId '=' pattern`
fn lower_field_list<'s>(
    node: &SyntaxNode<'s, super::kind::KindAny>,
) -> Box<[FieldSyntax<'s, TypedNodes<'s>>]> {
    node.children()
        .filter(|n| matches!(n.cst.get(n.node_ref), Node::Rule(Rule::Field, _)))
        .map(|field_node| {
            let children: Vec<_> = field_node.children().collect();
            // After whitespace filtering: [LId, Eq, Pattern]
            let name = children[0].text();
            let value = children[2]
                .cast::<KindPattern>()
                .expect("field value must be KindPattern");
            FieldSyntax { name, value }
        })
        .collect::<Vec<_>>()
        .into_boxed_slice()
}
