import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DollarSign, Trophy, Users, Copy, CheckCircle, Star, Target, Calendar, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      if (user) {
        try {
          const rewardsData = await api.getRewards(user.id);
          setRewards(rewardsData);
        } catch (error) {
          console.error('Failed to fetch rewards:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRewards();
  }, [user]);

  const copyReferralCode = async () => {
    if (user) {
      await navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const unlockedRewards = rewards.filter(reward => reward.unlocked);
  const nextReward = rewards.find(reward => !reward.unlocked);
  const progressToNext = nextReward ? (user?.donationsRaised || 0) / nextReward.threshold * 100 : 100;

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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white animate-slideInLeft animate-glow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 animate-bounce-custom">Welcome back, {user?.name}!</h1>
            <p className="text-blue-100 text-lg">Keep up the amazing work raising funds for our cause</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <div className="text-2xl font-bold animate-pulse-custom">${user?.donationsRaised?.toLocaleString()}</div>
            <div className="text-blue-100">Total Raised</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-slideInLeft stagger-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Raised</p>
              <p className="text-2xl font-bold text-gray-900">${user?.donationsRaised?.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center animate-float">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-slideInLeft stagger-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Global Rank</p>
              <p className="text-2xl font-bold text-gray-900">#{user?.rank}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center animate-bounce-custom">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-slideInLeft stagger-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Rewards Unlocked</p>
              <p className="text-2xl font-bold text-gray-900">{unlockedRewards.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center animate-pulse-custom">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-slideInLeft stagger-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Days Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor((new Date().getTime() - new Date(user?.joinDate || '').getTime()) / (1000 * 60 * 60 * 24))}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center animate-float">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Referral Code Section */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 animate-slideInLeft hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Your Referral Code
          </h2>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4 animate-shimmer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Share this code to earn more donations</p>
                <p className="text-2xl font-bold text-gray-900 font-mono animate-pulse-custom">{user?.referralCode}</p>
              </div>
              <button
                onClick={copyReferralCode}
                className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 transform hover:scale-110 active:scale-95"
                title="Copy referral code"
              >
                {copied ? (
                  <CheckCircle className="w-5 h-5 text-green-600 animate-bounce-custom" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-600 hover:animate-bounce" />
                )}
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p className="mb-2">Share your referral code with:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Friends and family</li>
              <li>Social media followers</li>
              <li>Professional networks</li>
            </ul>
          </div>
        </div>

        {/* Progress to Next Reward */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 animate-slideInRight hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-600" />
            Progress to Next Reward
          </h2>
          
          {nextReward ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{nextReward.title}</span>
                <span className="text-sm text-gray-500">{Math.round(progressToNext)}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-1000 animate-pulse-custom"
                  style={{ width: `${Math.min(progressToNext, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>${user?.donationsRaised?.toLocaleString()} raised</span>
                <span>${nextReward.threshold.toLocaleString()} goal</span>
              </div>
              
              <p className="text-sm text-gray-600 mt-3">{nextReward.description}</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-bounce-custom" />
              <p className="text-lg font-medium text-gray-900">All rewards unlocked!</p>
              <p className="text-gray-600">You've achieved everything. Amazing work!</p>
            </div>
          )}
        </div>
      </div>

      {/* Rewards Section */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 animate-fadeInUp hover:shadow-xl transition-all duration-300">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
          Rewards & Achievements
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className={`p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 animate-slideInLeft ${
                reward.unlocked
                  ? 'border-green-200 bg-green-50 shadow-sm animate-glow'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
              style={{ animationDelay: `${reward.id * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl animate-float">{reward.icon}</span>
                {reward.unlocked && (
                  <CheckCircle className="w-5 h-5 text-green-600 animate-bounce-custom" />
                )}
              </div>
              
              <h3 className={`font-semibold mb-1 ${
                reward.unlocked ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {reward.title}
              </h3>
              
              <p className={`text-sm mb-2 ${
                reward.unlocked ? 'text-gray-700' : 'text-gray-400'
              }`}>
                {reward.description}
              </p>
              
              <div className="flex items-center justify-between text-xs">
                <span className={reward.unlocked ? 'text-green-600 font-medium' : 'text-gray-400'}>
                  ${reward.threshold.toLocaleString()} goal
                </span>
                {reward.unlocked && (
                  <span className="text-green-600 font-medium">Unlocked!</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;