import { KRLangGrammarParser, TodoExpressionsContext } from '../../ANTLR/KRLangGrammarParser';
import { KRLangGrammarLexer } from '../../ANTLR/KRLangGrammarLexer';
import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import { KRLangErrorListener, IKRLangError } from './KRLangErrorListener';

function parse(code: string): { ast: TodoExpressionsContext; errors: IKRLangError[] } {
  const inputStream = new ANTLRInputStream(code);
  const lexer = new KRLangGrammarLexer(inputStream);
  lexer.removeErrorListeners();
  const todoLangErrorsListner = new KRLangErrorListener();
  lexer.addErrorListener(todoLangErrorsListner);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new KRLangGrammarParser(tokenStream);
  parser.removeErrorListeners();
  parser.addErrorListener(todoLangErrorsListner);
  const ast = parser.todoExpressions();
  const errors: IKRLangError[] = todoLangErrorsListner.getErrors();
  return { ast, errors };
}
export function parseAndGetASTRoot(code: string): TodoExpressionsContext {
  const { ast } = parse(code);
  return ast;
}
export function parseAndGetSyntaxErrors(code: string): IKRLangError[] {
  const { errors } = parse(code);
  return errors;
}
