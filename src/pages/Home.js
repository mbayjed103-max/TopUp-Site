import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Trophy,
  Users,
  IndianRupee,
  Award,
  Flame,
  ArrowRight,
} from "lucide-react";

const Home = () => {
  const [upcomingTournaments, setUpcomingTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const res = await axios.get("/tournaments?status=upcoming&limit=4");
      if (res.data.success) {
        setUpcomingTournaments(res.data.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-b from-dark-300 to-dark-400">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-neon-purple rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-blue rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-primary-600 rounded-full mb-6">
            <Flame className="w-5 h-5 mr-2 text-neon-yellow" />
            <span className="text-sm font-semibold">
              Bangladesh's #1 Free Fire Tournament Platform
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow">
            Battle for <br></br> <span className="gradient-text">GLORY</span>
            <br />& Prizes
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join the ultimate Free Fire tournament experience. Compete with
            Bangladesh's best players, showcase your skills, and win{" "}
            <span className="text-neon-green font-bold">
              amazing cash prizes
            </span>
            .
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/tournaments"
              className="btn-primary flex items-center gap-2"
            >
              Join Tournament <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/leaderboard" className="btn-secondary">
              View Leaderboard
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-16">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold gradient-text">
                10K+
              </div>
              <div className="text-gray-400 mt-2">Elite Warriors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-neon-blue">
                ₹50L+
              </div>
              <div className="text-gray-400 mt-2">Prize Pool</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-neon-green">
                500+
              </div>
              <div className="text-gray-400 mt-2">Epic Battles</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Tournaments */}
      <section className="py-16 px-4 bg-dark-400">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Upcoming Tournaments</h2>
            <p className="text-gray-400">
              Join the most competitive tournaments and win prizes
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="loading-skeleton h-80 rounded-xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingTournaments.map((tournament) => (
                <Link
                  key={tournament._id}
                  to={`/tournaments/${tournament._id}`}
                  className="card-gaming group hover:scale-105"
                >
                  {tournament.banner && (
                    <img
                      src={`http://localhost:5000${tournament.banner}`}
                      alt={tournament.title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <span className="badge bg-neon-purple text-white">
                      {tournament.gameMode}
                    </span>
                    <span className="badge bg-primary-600 text-white">
                      ₹{tournament.entryFee}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-neon-purple transition-colors">
                    {tournament.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4 text-neon-green" />₹
                      {tournament.prizePool}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {tournament.currentParticipants}/
                      {tournament.maxParticipants}
                    </span>
                  </div>
                  <button className="mt-4 w-full py-2 bg-gradient-to-r from-primary-600 to-neon-purple rounded-lg font-semibold hover:shadow-neon transition-all">
                    Join Tournament
                  </button>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/tournaments"
              className="btn-primary inline-flex items-center gap-2"
            >
              View All Tournaments <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-16 px-4 bg-dark-300">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Flame className="w-16 h-16 text-neon-yellow mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Platform Dominance</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card text-center group hover:scale-105 transition-transform">
              <Users className="w-12 h-12 text-neon-purple mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">15,000+</div>
              <div className="text-gray-400">Active Warriors</div>
            </div>
            <div className="card text-center group hover:scale-105 transition-transform">
              <Trophy className="w-12 h-12 text-neon-blue mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">750+</div>
              <div className="text-gray-400">Epic Tournaments</div>
            </div>
            <div className="card text-center group hover:scale-105 transition-transform">
              <IndianRupee className="w-12 h-12 text-neon-green mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">₹1CR+</div>
              <div className="text-gray-400">Total Winnings</div>
            </div>
            <div className="card text-center group hover:scale-105 transition-transform">
              <Award className="w-12 h-12 text-neon-yellow mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">2,500+</div>
              <div className="text-gray-400">Championships Won</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-neon-purple">
        <div className="container mx-auto text-center">
          <Trophy className="w-16 h-16 text-neon-yellow mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Dominate the Battle?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of players competing for glory and prizes. Create
            your profile and become a champion.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-lg font-bold text-lg hover:scale-105 transition-transform"
          >
            Join Tournament
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
