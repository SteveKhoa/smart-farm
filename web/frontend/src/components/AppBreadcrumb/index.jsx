import { Breadcrumbs, Link } from "@mui/joy";

const AppBreadcrumb = () => {
    const breadcrumbStack = [
        { name: "Home", href: "#" },
    //  { name: "Some Link", href: "#" },
    ]; // WARNING: this feature is not implemented and will always display "Home" by default

    return (
        <Breadcrumbs size="md" separator=">">
            {breadcrumbStack.map((nav, index) => (
                <Link href={nav.href}>{nav.name}</Link>
            ))}
        </Breadcrumbs>
    );
};

export default AppBreadcrumb;