import React, { useMemo, useState } from 'react';
import { Bot, User, FileText, ChevronLeft, ChevronRight, ExternalLink, Eye } from 'lucide-react';
import { renderMarkdown } from '../utils/helpers';

/**
 * Renders a single chat message bubble (user / assistant / system).
 * @param {{ msg: { role: string, content: string, sources?: Array }, onPreview?: (target: any) => void }} props
 */

function CitationsCarousel({ sources, onPreview }) {
  const [activeIndex, setActiveIndex] = useState(0);
  if (!sources || sources.length === 0) return null;

  const normalized = useMemo(() => {
    return sources
      .filter((s) => s && (s.url || s.source || s.domain || s.title))
      .map((s, idx) => ({
        type: s.type || 'source',
        citation_number: Number.isFinite(Number(s.citation_number)) ? Number(s.citation_number) : idx + 1,
        title: s.title || s.source || s.domain || 'Source',
        url: s.url || null,
        filename: s.source || null,
        domain: s.domain || (s.url ? (() => { try { return new URL(s.url).hostname; } catch { return null; } })() : null) || s.source || 'Source',
        snippet: s.snippet || s.text_snippet || '',
      }))
      .sort((a, b) => a.citation_number - b.citation_number);
  }, [sources]);

  const total = normalized.length;
  const current = normalized[Math.min(Math.max(activeIndex, 0), total - 1)];

  return (
    <div className="web-citations" aria-label="Citations">
      <div className="web-citations__topbar">
        <div className="web-citations__nav">
          <button
            className="web-citations__navbtn"
            type="button"
            aria-label="Previous source"
            onClick={() => setActiveIndex((p) => (p - 1 + total) % total)}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="web-citations__counter">
            {activeIndex + 1}/{total}
          </span>
          <button
            className="web-citations__navbtn"
            type="button"
            aria-label="Next source"
            onClick={() => setActiveIndex((p) => (p + 1) % total)}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="web-citations__meta">
          <div className="web-citations__favstack" aria-hidden="true">
            {normalized.slice(0, 3).map((src, i) => (
              src.type === 'kb' || src.type === 'sql_agent' || src.type === 'neo4j' || src.filename ? (
                <div key={i} className="web-citations__fav" style={{display:'flex', alignItems:'center', justifyContent:'center', background:'var(--color-bg-light)', color:'var(--color-primary)'}}>
                  <FileText size={14} />
                </div>
              ) : (
                <img
                  key={src.url || src.domain || i}
                  className="web-citations__fav"
                  src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(src.domain)}&sz=64`}
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              )
            ))}
          </div>
          <span className="web-citations__sources">{total} sources</span>
        </div>
      </div>

      {current ? (
        <div className="web-citations__preview">
          <div className="web-citations__domain">
            {current.type === 'kb' || current.type === 'sql_agent' || current.type === 'neo4j' || current.filename ? (
              <div style={{display:'flex', alignItems:'center', gap:'4px'}}><FileText size={12}/> Document</div>
            ) : current.domain}
          </div>
          <div className="web-citations__titleRow">
            {current.url ? (
              <a className="web-citations__title" href={current.url} target="_blank" rel="noopener noreferrer">
                {current.title}
                <ExternalLink size={14} className="web-citations__ext" />
              </a>
            ) : current.filename ? (
              <a 
                className="web-citations__title" 
                href="#" 
                onClick={(e) => { e.preventDefault(); onPreview && onPreview({ filename: current.filename }); }}
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                {current.title}
                <Eye size={14} className="web-citations__ext" style={{marginLeft: '4px'}} />
              </a>
            ) : (
              <div className="web-citations__title">{current.title}</div>
            )}
          </div>

          {current.snippet ? <div className="web-citations__snippet">{current.snippet}</div> : null}

          <div className="web-citations__actions">
            {(current.url || current.filename || current.type === 'pgvector' || current.type === 'sql_agent' || current.type === 'neo4j') ? (
              <button
                type="button"
                className="web-citations__btn"
                onClick={() => {
                  if (onPreview) {
                    if (current.url) {
                      onPreview({ url: current.url });
                    } else if (current.type === 'pgvector' || current.type === 'sql_agent' || current.type === 'neo4j') {
                      onPreview({ inlineText: current.snippet || 'No preview text available.', inlineTitle: current.title });
                    } else if (current.filename) {
                      onPreview({ filename: current.filename });
                    }
                  }
                }}
              >
                <Eye size={14} /> Preview
              </button>
            ) : null}
            {current.url ? (
              <a className="web-citations__btn web-citations__btnLink" href={current.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={14} /> Open
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}


function MessageBubble({ msg, onPreview }) {
  const isUser      = msg.role === 'user';
  const isAssistant = msg.role === 'assistant';
  const isSystem    = msg.role === 'system';

  const allSources = useMemo(() => {
    return (msg.sources || []).filter((s) => s);
  }, [msg.sources]);

  return (
    <div className={`message-row message-row--${isUser ? 'user' : 'system'}`}>
      {/* Bot/System Avatar */}
      {!isUser && (
        <div className={`msg-avatar msg-avatar--${isSystem ? 'system' : 'bot'}`}>
          {isSystem
            ? <FileText size={16} color="var(--color-muted)" />
            : <Bot size={16} color="#fff" />}
        </div>
      )}

      {/* Bubble */}
      <div className={`msg-bubble msg-bubble--${isUser ? 'user' : isAssistant ? 'assistant' : 'system'}`}>
        {isAssistant ? (
          <div
            className="md-body"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
          />
        ) : (
          <p className={`msg-text msg-text--${isUser ? 'user' : 'system'}`}>
            {msg.content}
          </p>
        )}

        {/* All citations (single unified box) */}
        {isAssistant && allSources.length > 0 ? (
          <div className="sources-section">
            <div className="sources-label">Citations</div>
            <CitationsCarousel sources={allSources} onPreview={onPreview} />
          </div>
        ) : null}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="msg-avatar msg-avatar--user">
          <User size={16} color="var(--color-primary)" />
        </div>
      )}
    </div>
  );
}

export default MessageBubble;
