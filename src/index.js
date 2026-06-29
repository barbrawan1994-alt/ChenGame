import React from 'react';
import { createRoot } from 'react-dom/client';
import RPG from './App';
import './App.css';

window.onerror = function(msg, src, line, col, err) {
  document.getElementById('root').innerHTML =
    '<main style="min-height:100dvh;padding:34px;color:#f9e7c1;background:radial-gradient(circle at 20% 20%,rgba(214,170,79,.18),transparent 28%),linear-gradient(145deg,#070b12,#101826 55%,#1a1110);font-family:Outfit,PingFang SC,Microsoft YaHei,sans-serif;overflow:auto">' +
    '<section style="max-width:720px;margin:8vh auto;padding:28px;border:1px solid rgba(242,195,107,.18);border-radius:24px;background:rgba(12,18,29,.82);box-shadow:0 24px 80px rgba(0,0,0,.45)">' +
    '<p style="margin:0 0 8px;color:#d6aa4f;font-size:12px;font-weight:800;letter-spacing:.22em;text-transform:uppercase">Battle system recovered</p>' +
    '<h1 style="margin:0 0 12px;font-size:30px;line-height:1.15">游戏遇到异常，存档仍保留在本机</h1>' +
    '<p style="margin:0 0 18px;color:rgba(249,231,193,.68);line-height:1.7">请先刷新重试。如果反复出现，可以导出浏览器本地存档后再继续排查。</p>' +
    '<button onclick="location.reload()" style="padding:12px 20px;border:0;border-radius:14px;background:linear-gradient(135deg,#b65632,#d6aa4f);color:#160f08;font-weight:900;cursor:pointer">刷新重试</button>' +
    '<details style="margin-top:20px;color:rgba(249,231,193,.58)"><summary style="cursor:pointer;color:#d6aa4f;font-weight:800">查看技术信息</summary><pre style="white-space:pre-wrap;font-size:12px;line-height:1.6;color:#d6d3d1">' + msg + '\\nat ' + src + ':' + line + ':' + col + '\\n' + (err && err.stack ? err.stack : '') + '</pre></details>' +
    '</section></main>';
};
window.onunhandledrejection = function(e) {
  document.getElementById('root').innerHTML =
    '<main style="min-height:100dvh;padding:34px;color:#f9e7c1;background:radial-gradient(circle at 20% 20%,rgba(214,170,79,.18),transparent 28%),linear-gradient(145deg,#070b12,#101826 55%,#1a1110);font-family:Outfit,PingFang SC,Microsoft YaHei,sans-serif;overflow:auto">' +
    '<section style="max-width:720px;margin:8vh auto;padding:28px;border:1px solid rgba(242,195,107,.18);border-radius:24px;background:rgba(12,18,29,.82);box-shadow:0 24px 80px rgba(0,0,0,.45)">' +
    '<p style="margin:0 0 8px;color:#d6aa4f;font-size:12px;font-weight:800;letter-spacing:.22em;text-transform:uppercase">Async action failed</p>' +
    '<h1 style="margin:0 0 12px;font-size:30px;line-height:1.15">一个异步操作没有完成</h1>' +
    '<p style="margin:0 0 18px;color:rgba(249,231,193,.68);line-height:1.7">请刷新重试；自动存档会继续使用浏览器本地数据。</p>' +
    '<button onclick="location.reload()" style="padding:12px 20px;border:0;border-radius:14px;background:linear-gradient(135deg,#b65632,#d6aa4f);color:#160f08;font-weight:900;cursor:pointer">刷新重试</button>' +
    '<details style="margin-top:20px;color:rgba(249,231,193,.58)"><summary style="cursor:pointer;color:#d6aa4f;font-weight:800">查看技术信息</summary><pre style="white-space:pre-wrap;font-size:12px;line-height:1.6;color:#d6d3d1">' + String(e.reason) + '</pre></details>' +
    '</section></main>';
};

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null, info: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { this.setState({ error, info }); }
  handleRetry = () => { this.setState({ error: null, info: null }); };
  render() {
    if (this.state.error) {
      return React.createElement('div', {
        style: { minHeight: '100dvh', padding: 34, color: '#f9e7c1', background: 'radial-gradient(circle at 20% 20%, rgba(214,170,79,.18), transparent 28%), linear-gradient(145deg, #070b12, #101826 55%, #1a1110)', fontFamily: 'Outfit, PingFang SC, Microsoft YaHei, sans-serif', overflow: 'auto' }
      },
        React.createElement('section', { style: { maxWidth: 720, margin: '8vh auto', padding: 28, border: '1px solid rgba(242,195,107,.18)', borderRadius: 24, background: 'rgba(12,18,29,.82)', boxShadow: '0 24px 80px rgba(0,0,0,.45)' } },
        React.createElement('p', { style: { margin: '0 0 8px', color: '#d6aa4f', fontSize: 12, fontWeight: 800, letterSpacing: '.22em', textTransform: 'uppercase' } }, 'Render recovered'),
        React.createElement('h1', { style: { margin: '0 0 12px', fontSize: 30, lineHeight: 1.15 } }, '界面渲染遇到异常'),
        React.createElement('p', { style: { margin: '0 0 18px', color: 'rgba(249,231,193,.68)', lineHeight: 1.7 } }, '刷新后会重新读取本地存档。如果反复出现，请保留下面的技术信息。'),
        React.createElement('button', {
          onClick: this.handleRetry,
          style: { margin: '0 10px 0 0', padding: '12px 20px', fontSize: 14, fontWeight: 900, background: 'linear-gradient(135deg,#b65632,#d6aa4f)', color: '#160f08', border: 'none', borderRadius: 14, cursor: 'pointer' }
        }, '返回游戏'),
        React.createElement('button', {
          onClick: () => window.location.reload(),
          style: { padding: '12px 20px', fontSize: 14, fontWeight: 800, background: 'rgba(255,255,255,.08)', color: '#f9e7c1', border: '1px solid rgba(242,195,107,.18)', borderRadius: 14, cursor: 'pointer' }
        }, '刷新页面'),
        React.createElement('details', { style: { marginTop: 20, color: 'rgba(249,231,193,.58)' } },
          React.createElement('summary', { style: { cursor: 'pointer', color: '#d6aa4f', fontWeight: 800 } }, '查看技术信息'),
          React.createElement('pre', { style: { fontSize: 12, color: '#d6d3d1', whiteSpace: 'pre-wrap', lineHeight: 1.6 } }, this.state.info?.componentStack),
          React.createElement('pre', { style: { fontSize: 11, color: '#a8a29e', whiteSpace: 'pre-wrap', lineHeight: 1.6 } }, this.state.error?.stack)
        ))
      );
    }
    return this.props.children;
  }
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(React.createElement(ErrorBoundary, null, React.createElement(RPG)));
