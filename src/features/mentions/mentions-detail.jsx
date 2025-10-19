import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useMentions } from '../../contexts/mentions/hooks/use-mentions';
import { useMentionsApi } from '../../contexts/mentions/hooks/use-mentions-api';
import './mentions-detail.css';

export function MentionDetails() {
  const { id } = useParams();
  const { mentions } = useMentions();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const navigate = useNavigate();
  const { updateMention, fetchUsers, sendReply } = useMentionsApi();

  const mention = mentions.find(m => m.id === id);

  const handleAssign = async () => {
    setLoading(true);
    setError(null);

    try {
      await updateMention(id, { userId: selectedUser || null });
      alert(
        selectedUser
          ? 'Mention assigned successfully'
          : 'Mention unassigned successfully'
      );
      // navigate('/mentions');
    } catch (err) {
      setError('Failed to assign mention');
      console.error('Failed to assign mention:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    setLoading(true);
    setError(null);

    try {
      await sendReply(id, { content: replyContent });
      alert('Reply sent successfully');
      navigate('/mentions');
    } catch (err) {
      setError('Failed to send reply');
      console.error('Failed to send reply:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      const users = await fetchUsers(abortController.signal);
      setUsers(users);
    })();
    return () => abortController.abort();
  }, [fetchUsers]);

  useEffect(() => {
    if (mention?.userId) {
      setSelectedUser(mention.userId);
    }
  }, [mention]);

  if (!mention) {
    return (
      <div className="mention-detail-container">
        <div className="error">Mention not found</div>
        <button onClick={() => navigate('/mentions')} className="back-button">
          Back to Mentions
        </button>
      </div>
    );
  }

  return (
    <div className="mention-detail-container">
      <div className="mention-detail-header">
        <h2>Mention Details</h2>
        <button onClick={() => navigate('/mentions')} className="back-button">
          Back to List
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="mention-detail-content">
        <div className="detail-section">
          <h3>Information</h3>
          <div className="detail-row">
            <label>ID:</label>
            <span>{mention.id}</span>
          </div>
          <div className="detail-row">
            <label>Platform:</label>
            <span>{mention.platform}</span>
          </div>
          <div className="detail-row">
            <label>Type:</label>
            <span>{mention.type}</span>
          </div>
          <div className="detail-row">
            <label>Content:</label>
            <span>{mention.content}</span>
          </div>
          <div className="detail-row">
            <label>Disposition:</label>
            <span
              className={
                mention.state !== 'replied' &&
                `status-badge ${mention.disposition || 'pending'}`
              }
            >
              {mention.state !== 'replied' &&
                (mention.disposition || 'pending')}
            </span>
          </div>
          <div className="detail-row">
            <label>Created At:</label>
            <span>{mention.createdAt}</span>
          </div>
          <div className="detail-row">
            <label>Status:</label>
            <span className={`status-badge ${mention.state || ''}`}>
              {mention.state}
            </span>
          </div>
          {mention.assignedTo && (
            <div className="detail-row">
              <label>Assigned To:</label>
              <span>{mention.assignedTo}</span>
            </div>
          )}
        </div>

        {mention.type === 'comment' && mention.state !== 'replied' && (
          <div className="detail-section">
            <h3>Assign to Teammate</h3>
            <div className="assign-form">
              <select
                value={selectedUser}
                onChange={e => setSelectedUser(e.target.value)}
                className="user-select"
                disabled={loading}
              >
                <option value="">Select a user...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.email}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssign}
                className="assign-button"
                disabled={loading}
              >
                {loading ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </div>
        )}

        {mention.type === 'comment' && mention.state !== 'replied' && (
          <div className="detail-section">
            <h3>Send Reply</h3>
            <textarea
              placeholder="Enter your reply..."
              rows={4}
              cols={50}
              name="replyContent"
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              className="reply-textarea"
              disabled={loading}
            />
            <div className="disposition-buttons">
              <button
                className="disposition-btn reply-btn"
                onClick={() => handleReply('reply')}
                disabled={loading}
              >
                Reply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
