use search::{parser::Parser, syntax::SyntaxNode};

fn main() {
    loop {
        let mut input = String::new();
        std::io::stdin().read_line(&mut input).unwrap();

        let mut diagnostics = vec![];
        let parser = Parser::new(&input, &mut diagnostics);
        let cst = parser.parse(&mut diagnostics);

        println!("{cst}");

        let syntax = SyntaxNode::root(&cst);
        println!("{syntax:#?}");
    }
}
