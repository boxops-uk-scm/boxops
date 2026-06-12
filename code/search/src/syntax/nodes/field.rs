use crate::syntax::family::NodeTypeFamily;
use crate::syntax::kind::KindPattern;

pub struct FieldSyntax<'s, F: NodeTypeFamily<'s>> {
    pub name: &'s str,
    pub value: F::NodeType<KindPattern>,
}
