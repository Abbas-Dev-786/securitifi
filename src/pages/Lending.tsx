import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coins, TrendingUp, Clock, Shield, Plus, Search, Filter, AlertCircle, CheckCircle, DollarSign } from 'lucide-react';
import { useLendingPool } from '../hooks/useLendingPool';
import { usePropertyManager } from '../hooks/usePropertyManager';
import { formatEther } from 'ethers';

const Lending: React.FC = () => {
  const { 
    depositCollateral, 
    borrowStablecoin, 
    repayLoan, 
    fetchUserLoans, 
    loans, 
    loading 
  } = useLendingPool();
  const { properties, fetchUserProperties } = usePropertyManager();
  
  const [activeTab, setActiveTab] = useState<'borrow' | 'lend'>('borrow');
  const [collateralForm, setCollateralForm] = useState({
    propertyId: '',
    amount: ''
  });
  const [borrowForm, setBorrowForm] = useState({
    amount: ''
  });
  const [repayForm, setRepayForm] = useState({
    amount: ''
  });

  // Mock lending opportunities for the lend tab
  const mockLendingOpportunities = [
    {
      id: 1,
      borrower: '0x1234...5678',
      propertyId: 'PROP-002',
      requestedAmount: '$60,000',
      interestRate: '9.0%',
      duration: '18 months',
      ltv: '70%',
      riskScore: 'A'
    },
    {
      id: 2,
      borrower: '0xabcd...efgh',
      propertyId: 'PROP-004',
      requestedAmount: '$40,000',
      interestRate: '8.8%',
      duration: '12 months',
      ltv: '65%',
      riskScore: 'B+'
    }
  ];

  const stats = [
    { 
      title: 'Total Borrowed', 
      value: '$125,000', 
      icon: Coins, 
      color: 'from-blue-500 to-cyan-500',
      description: 'Active loan amount'
    },
    { 
      title: 'Active Loans', 
      value: loans.length.toString(), 
      icon: Clock, 
      color: 'from-green-500 to-emerald-500',
      description: 'Current positions'
    },
    { 
      title: 'Avg Interest Rate', 
      value: '7.85%', 
      icon: TrendingUp, 
      color: 'from-purple-500 to-pink-500',
      description: 'Weighted average'
    },
    { 
      title: 'Collateral Ratio', 
      value: '155%', 
      icon: Shield, 
      color: 'from-orange-500 to-red-500',
      description: 'Health factor'
    }
  ];

  useEffect(() => {
    fetchUserProperties();
    fetchUserLoans();
  }, [fetchUserProperties, fetchUserLoans]);

  const handleDepositCollateral = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await depositCollateral(parseInt(collateralForm.propertyId), collateralForm.amount);
      setCollateralForm({ propertyId: '', amount: '' });
    } catch (error) {
      console.error('Failed to deposit collateral:', error);
    }
  };

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await borrowStablecoin(borrowForm.amount);
      setBorrowForm({ amount: '' });
    } catch (error) {
      console.error('Failed to borrow:', error);
    }
  };

  const handleRepay = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await repayLoan(repayForm.amount);
      setRepayForm({ amount: '' });
    } catch (error) {
      console.error('Failed to repay:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">DeFi Lending</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Borrow against your properties or lend to earn yield
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.description}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('borrow')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'borrow'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Borrow
          </button>
          <button
            onClick={() => setActiveTab('lend')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'lend'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Lend
          </button>
        </div>

        {activeTab === 'borrow' ? (
          <div className="space-y-8">
            {/* Deposit Collateral */}
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Deposit Collateral</span>
              </h3>
              
              <form onSubmit={handleDepositCollateral} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Property
                    </label>
                    <select 
                      value={collateralForm.propertyId}
                      onChange={(e) => setCollateralForm(prev => ({ ...prev, propertyId: e.target.value }))}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a property</option>
                      {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                          Property #{property.id} - {property.propertyAddress}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount (Tokens)
                    </label>
                    <input
                      type="number"
                      value={collateralForm.amount}
                      onChange={(e) => setCollateralForm(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.0"
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Approve Tokens
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !collateralForm.propertyId || !collateralForm.amount}
                    className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Depositing...' : 'Deposit Collateral'}
                  </button>
                </div>
              </form>
            </div>

            {/* Borrow Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Borrow USDC</span>
                </h3>
                
                <form onSubmit={handleBorrow} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount (USDC)
                    </label>
                    <input
                      type="number"
                      value={borrowForm.amount}
                      onChange={(e) => setBorrowForm({ amount: e.target.value })}
                      placeholder="0.0"
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Available to borrow:</span>
                      <span className="font-medium text-gray-900 dark:text-white">$75,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Interest rate:</span>
                      <span className="font-medium text-gray-900 dark:text-white">8.5% APR</span>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading || !borrowForm.amount}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Borrowing...' : 'Borrow USDC'}
                  </button>
                </form>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Repay Loan</span>
                </h3>
                
                <form onSubmit={handleRepay} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Repay Amount (USDC)
                    </label>
                    <input
                      type="number"
                      value={repayForm.amount}
                      onChange={(e) => setRepayForm({ amount: e.target.value })}
                      placeholder="0.0"
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Outstanding debt:</span>
                      <span className="font-medium text-gray-900 dark:text-white">$50,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Accrued interest:</span>
                      <span className="font-medium text-gray-900 dark:text-white">$2,150</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Approve USDC
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !repayForm.amount}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Repaying...' : 'Repay Loan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Active Loans */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Your Loans
              </h3>
              <div className="space-y-4">
                {loans.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Coins className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No active loans</p>
                  </div>
                ) : (
                  loans.map((loan) => (
                    <div key={loan.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              Loan #{loan.id}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Property #{loan.tokenId} • {formatEther(loan.loanAmount)} USDC
                            </p>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="block">{loan.interestRate}% APR</span>
                            <span className="block">{loan.duration} days</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            loan.isActive && !loan.isRepaid
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : loan.isRepaid
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          }`}>
                            {loan.isRepaid ? 'Repaid' : loan.isActive ? 'Active' : 'Pending'}
                          </span>
                          <button className="text-primary-600 hover:text-primary-700 font-medium">
                            Manage
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search lending opportunities..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select className="pl-10 pr-8 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none appearance-none cursor-pointer">
                  <option>All Risk Levels</option>
                  <option>A Grade</option>
                  <option>B Grade</option>
                  <option>C Grade</option>
                </select>
              </div>
            </div>

            {/* Lending Opportunities */}
            <div className="space-y-4">
              {mockLendingOpportunities.map((opportunity) => (
                <div key={opportunity.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 hover:bg-white dark:hover:bg-gray-700 transition-colors border border-gray-200/50 dark:border-gray-600/50 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {opportunity.propertyId}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Borrower: {opportunity.borrower}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      opportunity.riskScore.startsWith('A')
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      Risk: {opportunity.riskScore}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {opportunity.requestedAmount}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Interest Rate</span>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {opportunity.interestRate}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {opportunity.duration}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">LTV</span>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {opportunity.ltv}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                      View Details
                    </button>
                    <button className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-lg font-medium transition-all duration-200">
                      Fund Loan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Lending;