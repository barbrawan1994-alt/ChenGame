import React from 'react';
import { RefreshCw } from 'lucide-react';

export function lazyScreen(load) {
  let Content = React.lazy(load);
  class ScreenBoundary extends React.Component {
    state = { failed: false };
    static getDerivedStateFromError() { return { failed: true }; }
    retry = () => {
      Content = React.lazy(load);
      this.setState({ failed: false });
    };
    render() {
      if (this.state.failed) return <div className="screen deferred-screen" role="alert">
        <p>此页面暂时无法打开</p>
        <button type="button" onClick={this.retry}><RefreshCw size={16} />重新加载</button>
      </div>;
      return <React.Suspense fallback={<div className="screen deferred-screen" role="status">正在加载...</div>}>
        <Content {...this.props} />
      </React.Suspense>;
    }
  }
  return ScreenBoundary;
}
