import { useState } from 'react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '', email: '', subject: 'General Inquiry', message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200 transition-colors duration-300">
            {/* Hero */}
            <div className="relative bg-secondary h-64 sm:h-80 md:h-96 w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1565008447742-97f6f38c985c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }} />
                <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white tracking-tight uppercase mb-4">
                        Beyond The Frame
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto font-light">
                        Premium Aluminum Fabrication &amp; Installation Solutions
                    </p>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-secondary via-primary to-secondary" />
            </div>

            {/* Main */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-display font-bold text-secondary dark:text-white sm:text-4xl">Get In Touch</h2>
                    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Have a project in mind? Reach out to our team of experts for consultations, quotes, or general inquiries.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Contact Form */}
                    <div className="bg-surface-light dark:bg-surface-dark p-8 rounded shadow-lg border-t-4 border-primary">
                        <h3 className="text-2xl font-display font-semibold text-secondary dark:text-white mb-6">Send us a Message</h3>

                        {submitted && (
                            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-800 dark:text-green-300 text-sm flex items-center">
                                <span className="material-icons-outlined mr-2">check_circle</span>
                                Message sent successfully! We'll get back to you soon.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="name">Full Name</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-icons text-gray-400 text-sm">person</span>
                                        </div>
                                        <input
                                            className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-background-dark dark:text-white py-3 transition-colors"
                                            id="name"
                                            placeholder="John Doe"
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">Email Address</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-icons text-gray-400 text-sm">email</span>
                                        </div>
                                        <input
                                            className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-background-dark dark:text-white py-3 transition-colors"
                                            id="email"
                                            placeholder="you@example.com"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="subject">Subject</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-icons text-gray-400 text-sm">label</span>
                                    </div>
                                    <select
                                        className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-background-dark dark:text-white py-3 transition-colors"
                                        id="subject"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    >
                                        <option>General Inquiry</option>
                                        <option>Request a Quote</option>
                                        <option>Project Consultation</option>
                                        <option>Careers</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="message">Message</label>
                                <div className="mt-1">
                                    <textarea
                                        className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-background-dark dark:text-white p-3 transition-colors"
                                        id="message"
                                        placeholder="How can we help you?"
                                        rows="4"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 uppercase tracking-wider"
                                type="submit"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Info & Map */}
                    <div className="flex flex-col gap-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded shadow hover:shadow-md transition-shadow duration-300 flex items-start space-x-4 border-l-4 border-primary">
                                <div className="flex-shrink-0">
                                    <span className="material-icons text-primary text-3xl">location_on</span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-display font-medium text-secondary dark:text-white">Our Office</h4>
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        123 Industrial Blvd,<br />
                                        Building B, Suite 100<br />
                                        Metropolitan City, ST 12345
                                    </p>
                                </div>
                            </div>
                            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded shadow hover:shadow-md transition-shadow duration-300 flex items-start space-x-4 border-l-4 border-primary">
                                <div className="flex-shrink-0">
                                    <span className="material-icons text-primary text-3xl">phone</span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-display font-medium text-secondary dark:text-white">Phone &amp; Fax</h4>
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="block mb-1">P: (555) 123-4567</span>
                                        <span className="block">F: (555) 987-6543</span>
                                    </p>
                                </div>
                            </div>
                            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded shadow hover:shadow-md transition-shadow duration-300 flex items-start space-x-4 border-l-4 border-primary sm:col-span-2">
                                <div className="flex-shrink-0">
                                    <span className="material-icons text-primary text-3xl">email</span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-display font-medium text-secondary dark:text-white">Email</h4>
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        <a className="hover:text-primary transition-colors" href="mailto:info@axisaluminum.com">info@axisaluminum.com</a>
                                        <span className="mx-2 text-gray-300">|</span>
                                        <a className="hover:text-primary transition-colors" href="mailto:sales@axisaluminum.com">sales@axisaluminum.com</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-grow min-h-[300px] rounded-lg overflow-hidden shadow-lg relative border border-gray-200 dark:border-gray-700">
                            <iframe
                                allowFullScreen
                                className="absolute inset-0 w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500"
                                loading="lazy"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1837920360675!2d-73.9877316845941!3d40.74844454348528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1620668474261!5m2!1sen!2sus"
                                title="Office Location"
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
