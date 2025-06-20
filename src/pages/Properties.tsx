import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  MapPin,
  Eye,
  Edit,
  Shield,
  Check,
  X,
} from "lucide-react";
import PropertyForm from "../components/property/PropertyForm";
import { formatEther } from "viem";
// import { useAppKitAccount } from "@reown/appkit/react";
import { usePropertyManager } from "../hooks/usePropertyManager";
import { toast } from "react-toastify"; // For user feedback

const Properties: React.FC = () => {
  // const { address } = useAppKitAccount();
  const {
    isConnected,
    // isCorrectNetwork,
    isOwner,
    properties,
    // submitProperty,
    verifyProperty,
    storeMetadata,
    getPropertyDetails,
    loading,
    error,
  } = usePropertyManager();

  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "verified" | "unverified"
  >("all");
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [editPropertyId, setEditPropertyId] = useState<number | null>(null);
  const [editMetadataURI, setEditMetadataURI] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("5054"); // Default Chainlink subscription ID

  // Show error toast when error changes
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Filter properties
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.id
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "verified" && property.verified) ||
      (filterStatus === "unverified" && !property.verified);

    return matchesSearch && matchesFilter;
  });

  // Handle property submission
  // const handleSubmitProperty = async (
  //   metadataURI: string,
  //   initialValue: string
  // ) => {
  //   if (!isOwner) {
  //     toast.error("Only the contract owner can submit properties");
  //     return;
  //   }
  //   try {
  //     await submitProperty(metadataURI, initialValue);
  //     toast.success("Property submitted successfully");
  //     setShowForm(false);
  //   } catch (err: any) {
  //     toast.error(`Failed to submit property: ${err.message}`);
  //   }
  // };

  // Handle property verification
  const handleVerifyProperty = async (propertyId: number) => {
    if (!isOwner) {
      toast.error("Only the contract owner can verify properties");
      return;
    }
    if (!subscriptionId) {
      toast.error("Please provide a valid Chainlink subscription ID");
      return;
    }
    try {
      await verifyProperty(propertyId.toString(), subscriptionId);
      toast.success("Verification requested successfully");
    } catch (err: any) {
      toast.error(`Failed to verify property: ${err.message}`);
    }
  };

  // Handle metadata update
  const handleUpdateMetadata = async () => {
    if (!isOwner) {
      toast.error("Only the contract owner can update metadata");
      return;
    }
    if (!editPropertyId || !editMetadataURI) {
      toast.error("Please provide a property ID and metadata URI");
      return;
    }
    try {
      await storeMetadata(editPropertyId.toString(), editMetadataURI);
      toast.success("Metadata updated successfully");
      setShowEditForm(false);
      setEditPropertyId(null);
      setEditMetadataURI("");
      // Refresh selected property details
      if (selectedProperty?.id === editPropertyId) {
        const updatedProperty = await getPropertyDetails(
          editPropertyId.toString()
        );
        setSelectedProperty(updatedProperty);
      }
    } catch (err: any) {
      toast.error(`Failed to update metadata: ${err.message}`);
    }
  };

  // Handle form success
  const handleFormSuccess = () => {
    setShowForm(false);
  };

  // Render connection/network prompts
  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-12 border border-gray-200 dark:border-gray-700 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Connect Wallet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please connect your wallet to view and manage properties.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Properties
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your tokenized real estate portfolio
          </p>
        </div>
        {isOwner && (
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 md:mt-0 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Tokenize Property</span>
          </button>
        )}
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search properties by ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as "all" | "verified" | "unverified"
                )
              }
              className="pl-10 pr-8 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Properties</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Properties Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg animate-pulse"
            >
              <div className="w-full h-48 bg-gray-300 dark:bg-gray-600 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : filteredProperties.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-12 border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Properties Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by tokenizing your first property"}
            </p>
            {isOwner && !searchTerm && filterStatus === "all" && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
              >
                Tokenize Property
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative">
                <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 flex items-center justify-center">
                  {property.metadataURI ? (
                    <img
                      src={property.metadataURI}
                      alt={`Property #${property.id}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove(
                          "hidden"
                        );
                      }}
                    />
                  ) : null}
                  <MapPin className="w-12 h-12 text-primary-500 hidden" />
                </div>
                <div className="absolute top-4 right-4">
                  {property.verified ? (
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  ) : (
                    <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <X className="w-3 h-3" />
                      <span>Pending</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    Property #{property.id}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedProperty(property)}
                      className="p-2 text-gray-500 hover:text-primary-500 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {isOwner && (
                      <button
                        onClick={() => {
                          setEditPropertyId(property.id);
                          setEditMetadataURI(property.metadataURI);
                          setShowEditForm(true);
                        }}
                        className="p-2 text-gray-500 hover:text-primary-500 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="truncate">Property #{property.id}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {property.initialValue
                      ? `$${parseFloat(
                          formatEther(property.initialValue)
                        ).toLocaleString()}`
                      : "N/A"}
                  </div>
                </div>

                {isOwner && !property.verified && (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="Chainlink Subscription ID"
                      value={subscriptionId}
                      onChange={(e) => setSubscriptionId(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                    <button
                      onClick={() => handleVerifyProperty(property.id)}
                      disabled={loading || !subscriptionId}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Request Verification</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Property Form Modal */}
      {showForm && (
        <PropertyForm
          onClose={() => setShowForm(false)}
          // onSubmit={handleSubmitProperty}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Edit Metadata Modal */}
      {showEditForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowEditForm(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Update Property Metadata
              </h2>
              <button
                onClick={() => setShowEditForm(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Property ID
                </label>
                <p className="font-semibold text-gray-900 dark:text-white">
                  #{editPropertyId}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Metadata URI
                </label>
                <input
                  type="text"
                  value={editMetadataURI}
                  onChange={(e) => setEditMetadataURI(e.target.value)}
                  placeholder="ipfs://..."
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <button
                onClick={handleUpdateMetadata}
                disabled={loading || !editMetadataURI}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
              >
                Update Metadata
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Property Details Modal */}
      {selectedProperty && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedProperty(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Property Details
              </h2>
              <button
                onClick={() => setSelectedProperty(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    Property ID
                  </label>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    #{selectedProperty.id}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    Status
                  </label>
                  <p
                    className={`font-semibold ${
                      selectedProperty.verified
                        ? "text-green-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {selectedProperty.verified
                      ? "Verified"
                      : "Pending Verification"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Metadata URI
                </label>
                <p className="font-semibold text-gray-900 dark:text-white break-all">
                  {selectedProperty.metadataURI || "N/A"}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Property Value
                </label>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedProperty.initialValue
                    ? `$${parseFloat(
                        formatEther(selectedProperty.initialValue)
                      ).toLocaleString()}`
                    : "N/A"}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Initial Index
                </label>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedProperty.initialIndex
                    ? formatEther(selectedProperty.initialIndex)
                    : "N/A"}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Properties;
