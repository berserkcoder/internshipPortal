import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { Card } from '../components/Card';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import '../styles/admin-users.css';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [allResponse, pendingResponse] = await Promise.all([
        userService.getAllUsers(),
        userService.getPendingUsers(),
      ]);
      setUsers(allResponse.data.users || []);
      setPendingUsers(pendingResponse.data.users || []);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await userService.approveUser(userId);
      setSuccess('User approved successfully');
      fetchUsers();
    } catch (err) {
      setError('Failed to approve user');
    }
  };

  const handleReject = async (userId) => {
    try {
      await userService.rejectUser(userId);
      setSuccess('User rejected successfully');
      fetchUsers();
    } catch (err) {
      setError('Failed to reject user');
    }
  };

  if (loading) return <div className="container mt-4">Loading users...</div>;

  return (
    <div className="admin-users-container">
      <div className="container">
        <h1>User Management</h1>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <Users size={18} />
            All Users ({users.length})
          </button>
          <button
            className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <Clock size={18} />
            Pending ({pendingUsers.length})
          </button>
        </div>

        {activeTab === 'all' && (
          <div className="users-table-wrapper">
            {users.length === 0 ? (
              <Card>
                <p className="text-center">No users found</p>
              </Card>
            ) : (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.firstName} {user.lastName}</td>
                      <td>{user.email}</td>
                      <td><span className="role-badge">{user.role}</span></td>
                      <td>
                        {user.isApproved ? (
                          <span className="status-approved"><CheckCircle size={14} /> Approved</span>
                        ) : (
                          <span className="status-pending"><Clock size={14} /> Pending</span>
                        )}
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="pending-users">
            {pendingUsers.length === 0 ? (
              <Card>
                <p className="text-center">No pending approvals</p>
              </Card>
            ) : (
              <div className="pending-list">
                {pendingUsers.map((user) => (
                  <Card key={user._id} className="pending-card">
                    <div className="pending-header">
                      <div>
                        <h3>{user.firstName} {user.lastName}</h3>
                        <p className="email">{user.email}</p>
                        <span className="role-badge">{user.role}</span>
                      </div>
                      <div className="pending-actions">
                        <Button
                          onClick={() => handleApprove(user._id)}
                          variant="success"
                        >
                          <CheckCircle size={18} />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(user._id)}
                          variant="danger"
                        >
                          <XCircle size={18} />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
