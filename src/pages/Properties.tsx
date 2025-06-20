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
import { formatEther } from "ethers";
import { useReadContract } from "wagmi";
import { readContract } from "wagmi/actions";
import { PROPERTY_MANAGER_CONTRACT_ADDRESS } from "../constants";
import propertyManagerJson from "./../abis/PropertyManager.json";
import { config } from "../config";

type Property = {
  id: number;
  propertyAddress: string;
  isVerified: boolean;
  owner: string;
  propertyValue: string;
  metadataURI: string;
  createdAt?: Date;
};

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  // get property count
  const { data: propertyCount, isLoading } = useReadContract({
    abi: propertyManagerJson.abi,
    address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
    functionName: "propertyCount",
  });

  // Fetch properties
  useEffect(() => {
    if (propertyCount) {
      const fetchProperties = async () => {
        const props = [];
        for (let i = 1; i <= Number(propertyCount); i++) {
          const data = await readContract(config, {
            address: PROPERTY_MANAGER_CONTRACT_ADDRESS,
            abi: propertyManagerJson.abi,
            functionName: "getPropertyDetails",
            args: [i],
          });
          props.push({ id: i, ...(data as Property) });
        }
        setProperties(props);
      };
      fetchProperties();
    }
  }, [propertyCount]);

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property?.propertyAddress
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "verified" && property.isVerified) ||
      (filterStatus === "unverified" && !property.isVerified);

    return matchesSearch && matchesFilter;
  });

  const handleVerifyProperty = async (tokenId: number) => {
    try {
      console.log(tokenId);
      // await verifyProperty(tokenId);
    } catch (error) {
      console.error("Failed to verify property:", error);
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Properties
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your tokenized real estate portfolio
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 md:mt-0 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Tokenize Property</span>
        </button>
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
              placeholder="Search properties by address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
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
      {isLoading ? (
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
            {!searchTerm && filterStatus === "all" && (
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
                  <MapPin className="w-12 h-12 text-primary-500" />
                </div>
                <div className="absolute top-4 right-4">
                  {property.isVerified ? (
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
                    <button className="p-2 text-gray-500 hover:text-primary-500 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="truncate">{property.propertyAddress}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    $
                    {parseFloat(
                      formatEther(property.propertyValue)
                    ).toLocaleString()}
                  </div>
                </div>

                {!property.isVerified && (
                  <button
                    onClick={() => handleVerifyProperty(property.id)}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Request Verification</span>
                  </button>
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
          onSuccess={() => {
            setShowForm(false);
            // fetchUserProperties();
          }}
        />
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
                    Token ID
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
                      selectedProperty.isVerified
                        ? "text-green-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {selectedProperty.isVerified
                      ? "Verified"
                      : "Pending Verification"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Property Address
                </label>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedProperty.propertyAddress}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Property Value
                </label>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  $
                  {parseFloat(
                    formatEther(selectedProperty.propertyValue)
                  ).toLocaleString()}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Owner
                </label>
                <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                  {selectedProperty.owner}
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
