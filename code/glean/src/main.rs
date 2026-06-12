use codespan_reporting::{
    files::SimpleFile,
    term::{
        self, Config,
        termcolor::{ColorChoice, StandardStream},
    },
};
use glean::{
    syntax::{cst::CstNode, lower::Lowering, parser::Parser},
    types::{FreshTyVar, Subst, TyVar, Type, unify},
};

pub fn repl() {
    loop {
        let mut input = String::new();
        std::io::stdin().read_line(&mut input).unwrap();
        let input = input.trim();

        let mut diagnostics = vec![];
        let parser = Parser::new(&input, &mut diagnostics);
        let cst = parser.parse(&mut diagnostics);

        let writer = StandardStream::stderr(ColorChoice::Auto);
        let config = Config::default();
        let file = SimpleFile::new("<stdin>", &input);

        for diagnostic in diagnostics.iter() {
            term::emit_to_write_style(&mut writer.lock(), &config, &file, diagnostic).unwrap();
        }

        if !diagnostics.is_empty() {
            continue;
        }

        let cst_node = CstNode::new(&cst);
        let lowering = Lowering::new();
        let lowered = lowering.lower(&cst_node);

        println!("{:#?}", lowered);
    }
}

pub fn main() {
    let mut s = Subst::default();
    let mut f = FreshTyVar::default();

    let a = f.fresh();
    let b = f.fresh();

    unify(&mut s, &a, &Type::Int).unwrap();
    println!("a: {:?}", s.apply(&a));

    unify(&mut s, &a, &b).unwrap();
    println!("b: {:?}", s.apply(&b));

    println!("a ~ Str: {:?}", unify(&mut s, &a, &Type::Str));

    let x = s.foo;
}
