use std::io::{self, Write};

use codespan_reporting::{
    files::SimpleFile,
    term::{
        self, Config,
        termcolor::{ColorChoice, StandardStream},
    },
};
use crossterm::{
    cursor,
    event::{self, Event, KeyCode, KeyEvent, KeyEventKind, KeyModifiers},
    // execute,
    queue,
    style::{Color, ResetColor, SetForegroundColor},
    terminal::{self, Clear, ClearType},
};
use glean::syntax::{cst::CstNode, lexer, lower::Lowering, parser::Parser};

fn main() -> io::Result<()> {
    let mut editor = MiniEditor;

    while let Some(line) = editor.read_line("> ")? {
        let mut diagnostics = vec![];
        let parser = Parser::new(&line.trim(), &mut diagnostics);
        let cst = parser.parse(&mut diagnostics);

        let writer = StandardStream::stderr(ColorChoice::Auto);
        let config = Config::default();
        let file = SimpleFile::new("<stdin>", &line);

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

        io::stdout().flush()?;
    }

    Ok(())
}

struct TerminalGuard;

impl TerminalGuard {
    fn enter() -> io::Result<Self> {
        terminal::enable_raw_mode()?;
        // execute!(io::stdout(), cursor::Hide)?;
        Ok(Self)
    }
}

impl Drop for TerminalGuard {
    fn drop(&mut self) {
        // let _ = execute!(io::stdout(), ResetColor, cursor::Show);
        let _ = terminal::disable_raw_mode();
    }
}

struct MiniEditor;

impl MiniEditor {
    fn read_line(&mut self, prompt: &str) -> io::Result<Option<String>> {
        let _terminal = TerminalGuard::enter()?;

        let mut out = io::stdout();
        let mut state = EditorState::new(prompt.to_owned());

        render(&mut out, &state)?;

        loop {
            let event = event::read()?;

            let Event::Key(key) = event else {
                continue;
            };

            if key.kind != KeyEventKind::Press {
                continue;
            }

            match handle_key(&mut state, key) {
                KeyAction::Continue => {
                    render(&mut out, &state)?;
                }
                KeyAction::Submit => {
                    render(&mut out, &state)?;
                    write!(out, "\r\n")?;
                    out.flush()?;
                    return Ok(Some(state.buffer));
                }
                KeyAction::Abort => {
                    write!(out, "\r\n")?;
                    out.flush()?;
                    return Ok(None);
                }
            }
        }
    }
}

struct EditorState {
    prompt: String,
    buffer: String,
    cursor: usize,
}

impl EditorState {
    fn new(prompt: String) -> Self {
        Self {
            prompt,
            buffer: String::new(),
            cursor: 0,
        }
    }
}

enum KeyAction {
    Continue,
    Submit,
    Abort,
}

fn handle_key(state: &mut EditorState, key: KeyEvent) -> KeyAction {
    let ctrl = key.modifiers.contains(KeyModifiers::CONTROL);
    let alt = key.modifiers.contains(KeyModifiers::ALT);

    match key.code {
        KeyCode::Enter => KeyAction::Submit,

        KeyCode::Esc => KeyAction::Abort,

        KeyCode::Char('c') if ctrl => KeyAction::Abort,

        KeyCode::Char('d') if ctrl && state.buffer.is_empty() => KeyAction::Abort,

        KeyCode::Backspace => {
            if let Some(prev) = prev_char_boundary(&state.buffer, state.cursor) {
                state.buffer.replace_range(prev..state.cursor, "");
                state.cursor = prev;
            }
            KeyAction::Continue
        }

        KeyCode::Delete => {
            if let Some(next) = next_char_boundary(&state.buffer, state.cursor) {
                state.buffer.replace_range(state.cursor..next, "");
            }
            KeyAction::Continue
        }

        KeyCode::Left => {
            if let Some(prev) = prev_char_boundary(&state.buffer, state.cursor) {
                state.cursor = prev;
            }
            KeyAction::Continue
        }

        KeyCode::Right => {
            if let Some(next) = next_char_boundary(&state.buffer, state.cursor) {
                state.cursor = next;
            }
            KeyAction::Continue
        }

        KeyCode::Home => {
            state.cursor = 0;
            KeyAction::Continue
        }

        KeyCode::End => {
            state.cursor = state.buffer.len();
            KeyAction::Continue
        }

        KeyCode::Char(ch) if !ctrl && !alt => {
            state.buffer.insert(state.cursor, ch);
            state.cursor += ch.len_utf8();
            KeyAction::Continue
        }

        _ => KeyAction::Continue,
    }
}

fn render(out: &mut io::Stdout, state: &EditorState) -> io::Result<()> {
    queue!(
        out,
        cursor::MoveToColumn(0),
        Clear(ClearType::CurrentLine),
        ResetColor
    )?;

    write!(out, "{}", state.prompt)?;

    render_highlighted_range(out, &state.buffer, 0, state.buffer.len())?;

    let cursor_col = state.prompt.chars().count() + state.buffer[..state.cursor].chars().count();

    queue!(out, ResetColor, cursor::MoveToColumn(cursor_col as u16))?;

    out.flush()
}

#[derive(Clone, Debug)]
struct HighlightSpan {
    start: usize,
    end: usize,
    color: Color,
}

fn render_highlighted_range(
    out: &mut io::Stdout,
    line: &str,
    start: usize,
    end: usize,
) -> io::Result<()> {
    let spans = syntax_highlight(line);
    let mut offset = start;

    for span in spans {
        if span.end <= start || span.start >= end {
            continue;
        }

        let span_start = span.start.max(start);
        let span_end = span.end.min(end);

        if offset < span_start {
            queue!(out, ResetColor)?;
            write!(out, "{}", &line[offset..span_start])?;
        }

        queue!(out, SetForegroundColor(span.color))?;
        write!(out, "{}", &line[span_start..span_end])?;

        offset = span_end;
    }

    if offset < end {
        queue!(out, ResetColor)?;

        write!(out, "{}", &line[offset..end])?;
    }

    queue!(out, ResetColor)?;
    Ok(())
}

fn syntax_highlight(line: &str) -> Vec<HighlightSpan> {
    let mut diagnostics = Vec::new();
    let (tokens, spans) = lexer::tokenize(line, &mut diagnostics);

    let mut highlights = Vec::new();

    for (token, span) in tokens.iter().zip(spans.iter()) {
        let color = match token {
            // Keywords / control syntax
            lexer::Token::Where
            | lexer::Token::If
            | lexer::Token::Then
            | lexer::Token::Else
            | lexer::Token::Never => Color::Magenta,

            // Identifiers
            lexer::Token::UId => Color::White,
            lexer::Token::LId => Color::White,

            // Literals
            lexer::Token::Nat => Color::Cyan,
            lexer::Token::String => Color::Cyan,

            // Pattern-specific atoms
            lexer::Token::Wildcard => Color::DarkGrey,

            // Operators
            lexer::Token::Eq
            | lexer::Token::EqEq
            | lexer::Token::Neq
            | lexer::Token::Lte
            | lexer::Token::Gte
            | lexer::Token::Lt
            | lexer::Token::Gt
            | lexer::Token::Plus
            | lexer::Token::Minus
            | lexer::Token::Bang
            | lexer::Token::And
            | lexer::Token::AndAnd
            | lexer::Token::Pipe
            | lexer::Token::PipePipe
            | lexer::Token::Arrow
            | lexer::Token::DotDot => Color::DarkGrey,

            // Delimiters / punctuation
            lexer::Token::Dot
            | lexer::Token::Semi
            | lexer::Token::Comma
            | lexer::Token::Colon
            | lexer::Token::LPar
            | lexer::Token::RPar
            | lexer::Token::LBrace
            | lexer::Token::RBrace
            | lexer::Token::LBrack
            | lexer::Token::RBrack => Color::DarkGrey,

            lexer::Token::Whitespace => continue,

            lexer::Token::Error => Color::Red,
            _ => Color::DarkGrey,
        };

        highlights.push(HighlightSpan {
            start: span.start,
            end: span.end,
            color,
        });
    }

    highlights
}

fn prev_char_boundary(s: &str, pos: usize) -> Option<usize> {
    if pos == 0 {
        return None;
    }

    let mut i = pos - 1;
    while !s.is_char_boundary(i) {
        i -= 1;
    }

    Some(i)
}

fn next_char_boundary(s: &str, pos: usize) -> Option<usize> {
    if pos >= s.len() {
        return None;
    }

    let mut i = pos + 1;
    while i < s.len() && !s.is_char_boundary(i) {
        i += 1;
    }

    Some(i)
}
