use super::lexer::{Token, tokenize};

// TODO: change if codespan_reporting is not used
use codespan_reporting::diagnostic::Label;
pub type Diagnostic = codespan_reporting::diagnostic::Diagnostic<()>;

include!(concat!(env!("OUT_DIR"), "/generated.rs"));

fn is_comparison_operator(token: &Token) -> bool {
    matches!(
        token,
        Token::EqEq | Token::Neq | Token::Lte | Token::Gte | Token::Lt | Token::Gt
    )
}

impl<'a> ParserCallbacks<'a> for Parser<'a> {
    type Diagnostic = Diagnostic;
    type Context = ();

    fn create_tokens(
        _context: &mut Self::Context,
        source: &'a str,
        diags: &mut Vec<Self::Diagnostic>,
    ) -> (Vec<Token>, Vec<Span>) {
        tokenize(source, diags)
    }

    fn create_diagnostic(&self, span: Span, message: String) -> Self::Diagnostic {
        Self::Diagnostic::error()
            .with_message(message)
            .with_label(Label::primary((), span))
    }

    fn predicate_stmt_1(&self) -> bool {
        let mut depth = 0i32;
        for tok in self.tokens[self.pos..].iter() {
            match tok {
                Token::LPar | Token::LBrace => depth += 1,
                Token::RPar | Token::RBrace => {
                    depth -= 1;
                    if depth < 0 {
                        return false;
                    }
                }
                t if depth == 0 && is_comparison_operator(t) => {
                    return true;
                }
                Token::Eq | Token::Semi if depth == 0 => return false,
                _ => {}
            }
        }
        false
    }
}
