import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gray-900 dark:bg-black text-white pt-16 pb-8 border-t-4 border-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-2xl font-display font-bold uppercase tracking-tighter">
                                <span className="text-primary mr-1">//</span>AXIS
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Leading the industry in precision aluminum fabrication and installation. We build the future, one frame at a time.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-display text-lg font-bold uppercase mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-400 hover:text-primary transition-colors text-sm">Home</Link></li>
                            <li><Link to="/products" className="text-gray-400 hover:text-primary transition-colors text-sm">Products</Link></li>
                            <li><Link to="/projects" className="text-gray-400 hover:text-primary transition-colors text-sm">Projects</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-primary transition-colors text-sm">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-white font-display text-lg font-bold uppercase mb-4">Services</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">Design & Engineering</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">Fabrication</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">Installation</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">Maintenance</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-display text-lg font-bold uppercase mb-4">Contact</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-start">
                                <span className="material-icons-outlined text-primary mr-2 text-base">location_on</span>
                                <span>123 Industrial Ave, Sector 5<br />Building District, NY 10001</span>
                            </li>
                            <li className="flex items-center">
                                <span className="material-icons-outlined text-primary mr-2 text-base">phone</span>
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center">
                                <span className="material-icons-outlined text-primary mr-2 text-base">email</span>
                                <span>projects@axis-aluminum.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">© 2024 Axis Aluminum. All rights reserved.</p>
                    <p className="text-xs text-gray-600 mt-2 md:mt-0 font-display">BEYOND THE FRAME</p>
                </div>
            </div>
        </footer>
    );
}
