import React from 'react';
import { createRoot } from 'react-dom/client';
import RPG from './App';
import './App.css';

window.onerror = function(msg, src, line, col, err) {
  document.getElementById('root').innerHTML =
    '<div style="padding:40px;color:#ff4444;background:#111;font-family:monospace;white-space:pre-wrap;height:100vh;overflow:auto">' +
    '<h2>JS Error</h2><p>' + msg + '</p><p>at ' + src + ':' + line + ':' + col + '</p>' +
    '<pre style="color:#ccc">' + (err && err.stack ? err.stack : '') + '</pre></div>';
};
window.onunhandledrejection = function(e) {
  document.getElementById('root').innerHTML =
    '<div style="padding:40px;color:#ff4444;background:#111;font-family:monospace;white-space:pre-wrap;height:100vh;overflow:auto">' +
    '<h2>Unhandled Promise</h2><pre style="color:#ccc">' + String(e.reason) + '</pre></div>';
};

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null, info: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { this.setState({ error, info }); }
  handleRetry = () => { this.setState({ error: null, info: null }); };
  render() {
    if (this.state.error) {
      return React.createElement('div', {
        style: { padding: 40, color: '#ff4444', background: '#111', fontFamily: 'monospace', whiteSpace: 'pre-wrap', height: '100vh', overflow: 'auto' }
      },
        React.createElement('h2', null, 'React渲染错误'),
        React.createElement('p', null, String(this.state.error)),
        React.createElement('button', {
          onClick: this.handleRetry,
          style: { margin: '16px 0', padding: '12px 32px', fontSize: '16px', fontWeight: 'bold', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }
        }, '🔄 点击重试'),
        React.createElement('p', { style: { fontSize: 12, color: '#aaa' } }, '提示: 如果反复出现此错误，请关闭浏览器翻译插件或广告拦截插件后刷新页面。'),
        React.createElement('pre', { style: { fontSize: 12, color: '#ccc' } }, this.state.info?.componentStack),
        React.createElement('pre', { style: { fontSize: 11, color: '#999' } }, this.state.error?.stack)
      );
    }
    return this.props.children;
  }
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(React.createElement(ErrorBoundary, null, React.createElement(RPG)));
