import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Trophy, Medal, Award, TrendingUp, Crown, Star } from 'lucide-react';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const leaderboardData = await api.getLeaderboard();
        setUsers(leaderboardData);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-500" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">#{rank}</span>;
    }
  };

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 3:
        return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getLevelColor = (level) => {
    if (level.includes('Gold')) return 'text-yellow-600 bg-yellow-100';
    if (level.includes('Silver')) return 'text-gray-600 bg-gray-100';
    if (level.includes('Bronze')) return 'text-orange-600 bg-orange-100';
    return 'text-blue-600 bg-blue-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeInUp">
      {/* Header */}
      <div className="text-center animate-slideInLeft">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 animate-bounce-custom">Fundraising Leaderboard</h1>
        <p className="text-gray-600 text-lg">See how our top performers are making a difference</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-slideInRight">
        {users.slice(0, 3).map((user, index) => (
          <div
            key={user.id}
            className={`relative ${
              index === 0 ? 'order-2 md:order-2' : index === 1 ? 'order-1 md:order-1' : 'order-3 md:order-3'
            } animate-slideInLeft stagger-${index + 1}`}
          >
            <div className={`p-6 rounded-2xl border-2 text-center transform transition-all duration-300 hover:scale-110 hover:shadow-xl ${getRankStyle(user.rank)} ${index === 0 ? 'animate-glow' : ''}`}>
              <div className="flex justify-center mb-4 animate-bounce-custom">
                {getRankIcon(user.rank)}
              </div>
              
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                <span className="text-white font-bold text-lg">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-1">{user.name}</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${getLevelColor(user.level)}`}>
                {user.level}
              </span>
              
              <div className="text-2xl font-bold text-gray-900 mb-2 animate-pulse-custom">
                ${user.donationsRaised.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Total Raised</p>
            </div>
          </div>
        ))}
      </div>

      {/* Full Leaderboard */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-slideInLeft hover:shadow-xl transition-all duration-300">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 animate-shimmer">
          <h2 className="text-xl font-bold text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Complete Rankings
          </h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {users.map((user) => (
            <div
              key={user.id}
              className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 animate-slideInRight ${
                user.rank <= 3 ? 'bg-gradient-to-r from-blue-50/30 to-purple-50/30' : ''
              }`}
              style={{ animationDelay: `${user.rank * 0.1}s` }}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 animate-float">
                  {getRankIcon(user.rank)}
                </div>
                
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse-custom">
                  <span className="text-white font-bold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(user.level)}`}>
                      {user.level}
                    </span>
                    <span className="text-sm text-gray-500">
                      Joined {new Date(user.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900 animate-pulse-custom">
                  ${user.donationsRaised.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  Code: {user.referralCode}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeInUp">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center animate-slideInLeft stagger-1 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 animate-float">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2 animate-pulse-custom">
            ${users.reduce((sum, user) => sum + user.donationsRaised, 0).toLocaleString()}
          </div>
          <p className="text-gray-600">Total Raised by All Interns</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center animate-slideInLeft stagger-2 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 animate-bounce-custom">
            <Star className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2 animate-pulse-custom">
            {users.length}
          </div>
          <p className="text-gray-600">Active Fundraisers</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center animate-slideInLeft stagger-3 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 animate-float">
            <Trophy className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2 animate-pulse-custom">
            ${Math.round(users.reduce((sum, user) => sum + user.donationsRaised, 0) / users.length).toLocaleString()}
          </div>
          <p className="text-gray-600">Average per Intern</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;