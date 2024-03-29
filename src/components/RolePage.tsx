import {
  allowedAriaRolesByHtmlElement,
  ariaRolesByAbstractRole,
  ariaRolesWithPresentationalChildren,
  ariaToHtmlMapping,
  htmlElementsToDisplayNames,
  links,
  mappedAbstractAriaRolesToTitles,
  mappedAbstractAriaRolesToUrls,
  mappedAriaRolesToAllowedDescendants,
  mappedAriaRolesToContentCategories,
  mappedAriaRolesToContextRoles,
  mappedAriaRolesToDescriptions,
  mappedAriaRolesToDisplayNames,
  mappedAriaRolesToNotes,
  mappedContentTypesToTitles,
  mappedContentTypesToUrls,
} from "../../data";
import { ExternalLinkIcon } from "./Icons";

interface RolePageProps {
  role: string;
  abstractAriaRole: string;
}

export function RolePage({ role, abstractAriaRole }: RolePageProps) {
  const roleTitle = mappedAriaRolesToDisplayNames[role] || role;

  const abstractRoleTags = Object.entries(ariaRolesByAbstractRole)
    .filter(([, value]) => value.includes(role))
    .map(([key]) => key)
    .sort()
    .map((key) => [
      mappedAbstractAriaRolesToTitles[key] || key,
      mappedAbstractAriaRolesToUrls[key] || "",
    ]);

  const contentCategories = mappedAriaRolesToContentCategories[role] || [];

  const filteredContentCategories = contentCategories.filter(
    (contentCategory: string) =>
      ["flow", "phrasing", "interactive"].includes(contentCategory)
  );

  if (
    filteredContentCategories.includes("flow") &&
    filteredContentCategories.includes("phrasing")
  ) {
    // All `phrasing` roles are also `flow` roles
    filteredContentCategories.splice(
      filteredContentCategories.indexOf("flow"),
      1
    );
  }

  const contentCategoryTags = filteredContentCategories
    .sort()
    .map((contentCategory: string) => [
      mappedContentTypesToTitles[contentCategory] || contentCategory,
      mappedContentTypesToUrls[contentCategory] || "",
    ]);

  const contextTags = mappedAriaRolesToContextRoles[role]
    ? [["Required Context", "https://www.w3.org/TR/wai-aria-1.2/#scope"]]
    : [];

  const tags = [...abstractRoleTags, ...contentCategoryTags, ...contextTags];

  const mayBeInteractive = abstractRoleTags.length > 1;

  const allowedContent = mappedAriaRolesToAllowedDescendants[role] || "N/A";

  return (
    <div
      className={`content content--is-aria-role-${role} content--is-abstract-role-${abstractAriaRole}`}
    >
      <div className="content__header">
        <a
          href="#"
          className="content__close-button"
          aria-label="Return to Overview section"
        >
          <svg aria-hidden="true" fill="none" width="1rem" height="1rem">
            <use href="#close-icon"></use>
          </svg>
        </a>
        <div className="content__header__info">
          <div className="content__heading__container">
            <h1
              className="content__heading"
              id={role}
              aria-label={`The ${role} role`}
              tabIndex={-1}
              dangerouslySetInnerHTML={{
                __html: `<span aria-hidden="true">The ${roleTitle} role</span>`,
              }}
            ></h1>
          </div>
          <div className="content__links">
            {Object.entries(links).map(([name, link]) => (
              <a key={link} href={link + role} target="_blank">
                {name}
                <ExternalLinkIcon />
              </a>
            ))}
          </div>
          {tags ? (
            <p className="content__tags">
              {tags.map(([tagName, url]) => (
                <a
                  key={tagName}
                  href={url}
                  target="_blank"
                  className="content__tag"
                >
                  {tagName}
                  <ExternalLinkIcon />
                </a>
              ))}
            </p>
          ) : null}
        </div>
      </div>
      <div className="content__details">
        <h2 className="aria-role__subheading">Description</h2>
        <p>{mappedAriaRolesToDescriptions[role] || "--"}</p>

        {mayBeInteractive ? (
          <>
            <h2 className="aria-role__subheading">Note</h2>
            <p>
              *May be interactive or non-interactive depending on the context:{" "}
              {mappedAriaRolesToNotes[role] || ""}
            </p>
          </>
        ) : null}

        <h2 className="aria-role__subheading">Allowed Content</h2>
        <p>{allowedContent}</p>

        {ariaRolesWithPresentationalChildren.includes(role) && (
          <p>
            Browsers automatically apply the presentation role to all descendant
            elements.{" "}
            <em>
              The semantics of any descendant elements are not conveyed to
              assistive technologies.
            </em>
          </p>
        )}

        {mappedAriaRolesToContextRoles[role] && (
          <>
            <h2 className="aria-role__subheading">Required Context Roles</h2>
            <ul className="list">
              {mappedAriaRolesToContextRoles[role].map((contextRole) => (
                <li key={contextRole}>{contextRole}</li>
              ))}
            </ul>
          </>
        )}

        <h2 className="aria-role__subheading">
          HTML Elements with Implicit ARIA Role
        </h2>
        <ul className="list">
          {(ariaToHtmlMapping[role] || ["(None)"]).sort().map((tagName) => (
            <li className="tag-name" key={tagName}>
              {htmlElementsToDisplayNames[tagName] || tagName}
            </li>
          ))}
        </ul>

        <h2 className="aria-role__subheading">Allowed HTML Elements</h2>
        <ul className="list">
          {Array.from(
            new Set(
              Object.entries(allowedAriaRolesByHtmlElement)
                .filter(([_, roles]) => roles.includes(role))
                .map(([tagName]) => tagName)
                .concat(ariaToHtmlMapping[role] || [])
            )
          ).map((tagName) => (
            <li key={tagName}>
              <span className="tag-name">
                {htmlElementsToDisplayNames[tagName] || tagName}
              </span>
              {(ariaToHtmlMapping[role] || []).includes(tagName)
                ? " (role attribute unnecessary)"
                : ""}
            </li>
          ))}
          <li key="any">{`div, span, p, other elements that can receive any role`}</li>
        </ul>
      </div>
    </div>
  );
}
