import { useMentions } from '../../contexts/mentions/hooks/use-mentions';
import { useMentionsApi } from '../../contexts/mentions/hooks/use-mentions-api';
import { MentionsTable } from './mentions-table';
import { useNavigate } from 'react-router';
import { useState, useMemo, useEffect } from 'react';
import './mentions.css';

export function Mentions() {
  const { mentions, loading, error } = useMentions();
  const { fetchMentions, updateMention } = useMentionsApi();

  const [networkFilter, setNetworkFilter] = useState('');
  const [keywordFilter, setKeywordFilter] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchMentions();
  }, [fetchMentions]);

  // Get unique networks for filter dropdown
  const networks = useMemo(() => {
    const uniqueNetworks = [...new Set(mentions.map(m => m.platform))];
    return uniqueNetworks.filter(Boolean);
  }, [mentions]);

  // Apply filters
  const filteredMentions = useMemo(() => {
    return mentions.filter(mention => {
      const matchesNetwork =
        !networkFilter || mention.platform === networkFilter;
      const matchesKeyword =
        !keywordFilter ||
        mention.content?.toLowerCase().includes(keywordFilter.toLowerCase());
      return matchesNetwork && matchesKeyword;
    });
  }, [mentions, networkFilter, keywordFilter]);

  const handleRowClick = mention => {
    navigate(`/mentions/${mention.id}`);
  };

  const handleRefresh = () => {
    fetchMentions();
  };

  return (
    <div className="mentions-container">
      <div className="mentions-header">
        <h2>Mentions</h2>
        <button onClick={handleRefresh} className="refresh-button">
          Refresh
        </button>
      </div>

      {loading && <div className="loading">Loading mentions...</div>}

      {error && (
        <div className="error">
          <p>Error loading mentions: {error}</p>
          <button onClick={handleRefresh} className="refresh-button">
            Retry
          </button>
        </div>
      )}

      <div className="mentions-filters">
        <div className="filter-group">
          <label htmlFor="network-filter">Network:</label>
          <select
            id="network-filter"
            value={networkFilter}
            onChange={e => setNetworkFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Networks</option>
            {networks.map(network => (
              <option key={network} value={network}>
                {network}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="keyword-filter">Keyword:</label>
          <input
            id="keyword-filter"
            type="text"
            value={keywordFilter}
            onChange={e => setKeywordFilter(e.target.value)}
            placeholder="Search content..."
            className="filter-input"
          />
        </div>

        {(networkFilter || keywordFilter) && (
          <button
            onClick={() => {
              setNetworkFilter('');
              setKeywordFilter('');
            }}
            className="clear-filters-button"
          >
            Clear Filters
          </button>
        )}
      </div>

      <MentionsTable
        data={filteredMentions}
        onRowClick={handleRowClick}
        updateMention={updateMention}
      />
    </div>
  );
}
