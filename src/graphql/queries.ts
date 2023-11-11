const PAGEINFO_FRAGMENT = `
hasNextPage
hasPreviousPage
startCursor
endCursor
`;

const AGGREGATE_FRAGMENT = `
collectiveGovernance
developerEcosystem
opStack
endUserExperienceAndAdoption
total
`;

export const PROJECT_FRAGMENT = `
displayName
payoutAddress {
  address
}
websiteUrl
applicantType
bio
contributionDescription
contributionLinks {
  description
  type
  url
}
fundingSources {
  currency
  amount
  description
  type
}
id
includedInBallots
impactCategory
impactDescription
impactMetrics {
  description
  number
  url
}
profile {
  id
  name
  profileImageUrl
  bannerImageUrl
  websiteUrl
  bio
}
lists {
  id
  listName
  listDescription
  author {
    address
    resolvedName {
      name
    }
  }
  listContent {
    OPAmount
    project {
      id
    }
  }
}
`;
export const ProjectQuery = `
  query Project($id: ID!) {
    retroPGF {
      project(id: $id) {
        ${PROJECT_FRAGMENT}
      }
    }
  }
`;
export const ProjectsQuery = `
  query Projects($after: String, $first: Int!, $orderBy: ProjectOrder!, $category: [ProjectCategory!], $search: String, $seed: String) {
    retroPGF {
      projects(after: $after, first: $first, orderBy: $orderBy, category: $category, search: $search, seed: $seed) {
        pageInfo {
          ${PAGEINFO_FRAGMENT}
        }
        edges {
          cursor
          node {
            ${PROJECT_FRAGMENT}
          }
        }
      }
      projectsAggregate {
        ${AGGREGATE_FRAGMENT}
      }
    }
  }
`;

export const CategoriesQuery = `
  query {
    retroPGF {
      projectsAggregate {
        ${AGGREGATE_FRAGMENT}
      }
      listsAggregate {
        ${AGGREGATE_FRAGMENT}
        pairwise
      }
    }
  }
`;

export const LIST_FRAGMENT = `
id
listName
listDescription
categories
author {
  resolvedName {
    name
  }
  address
}
listContent {
  OPAmount
  project {
    id
    displayName
    profile {
      profileImageUrl
    }
  }
}
impactEvaluationLink
impactEvaluationDescription
`;
export const ListQuery = `
  query List($id: ID!) {
    retroPGF {
      list(id: $id) {
        ${LIST_FRAGMENT}
      }
    }
  }
`;
export const ListsQuery = `
  query Lists($after: String, $first: Int!, $orderBy: ListOrder!, $category: [ListCategory!], $search: String, $seed: String, $likedBy: String) {
    retroPGF {
      lists(after: $after, first: $first, orderBy: $orderBy, category: $category, search: $search, seed: $seed, likedBy: $likedBy) {
        pageInfo {
          ${PAGEINFO_FRAGMENT}
        }
        edges {
          cursor
          node {
            ${LIST_FRAGMENT}
          }
        }
      }
      listsAggregate {
        ${AGGREGATE_FRAGMENT}
      }
    }
  }
`;
