import { Link, usePage } from '@inertiajs/react';
import { logout } from '@/routes';

export default function AuthControl() {
    const { auth } = usePage().props;

    if (!auth.user) {
        return null;
    }

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{auth.user.name}</span>
            <Link
                href={logout()}
                as="button"
                className="text-sm text-gray-500 hover:text-gray-700"
            >
                ログアウト
            </Link>
        </div>
    );
}
