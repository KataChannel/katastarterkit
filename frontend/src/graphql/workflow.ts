import { gql } from '@apollo/client';

// ============================================
// FRAGMENTS
// ============================================

export const WORKFLOW_TEMPLATE_FRAGMENT = gql`
  fragment WorkflowTemplateFields on WorkflowTemplate {
    id
    code
    name
    description
    category
    icon
    color
    isActive
    version
    createdAt
    updatedAt
  }
`;

export const WORKFLOW_STEP_FRAGMENT = gql`
  fragment WorkflowStepFields on WorkflowStep {
    id
    stepNumber
    name
    description
    stepType
    config
    isRequired
    isActive
  }
`;

export const WORKFLOW_INSTANCE_FRAGMENT = gql`
  fragment WorkflowInstanceFields on WorkflowInstance {
    id
    instanceCode
    title
    description
    status
    currentStepNumber
    formData
    metadata
    relatedEntityType
    relatedEntityId
    completedAt
    createdAt
    updatedAt
  }
`;

// ============================================
// QUERIES
// ============================================

export const GET_WORKFLOW_TEMPLATES = gql`
  ${WORKFLOW_TEMPLATE_FRAGMENT}
  query GetWorkflowTemplates($category: String, $isActive: Boolean) {
    workflowTemplates(category: $category, isActive: $isActive) {
      ...WorkflowTemplateFields
    }
  }
`;

export const GET_WORKFLOW_TEMPLATE = gql`
  ${WORKFLOW_TEMPLATE_FRAGMENT}
  ${WORKFLOW_STEP_FRAGMENT}
  query GetWorkflowTemplate($id: ID!) {
    workflowTemplate(id: $id) {
      ...WorkflowTemplateFields
      steps {
        ...WorkflowStepFields
      }
    }
  }
`;

export const GET_WORKFLOW_INSTANCE = gql`
  ${WORKFLOW_INSTANCE_FRAGMENT}
  ${WORKFLOW_TEMPLATE_FRAGMENT}
  ${WORKFLOW_STEP_FRAGMENT}
  query GetWorkflowInstance($id: ID!) {
    workflowInstance(id: $id) {
      ...WorkflowInstanceFields
      workflowTemplate {
        ...WorkflowTemplateFields
        steps {
          ...WorkflowStepFields
        }
      }
      stepExecutions {
        id
        stepNumber
        status
        inputData
        outputData
        assignedTo
        completedBy
        startedAt
        completedAt
        workflowStep {
          ...WorkflowStepFields
        }
      }
      approvals {
        id
        stepNumber
        status
        decision
        comment
        respondedAt
        createdAt
        approver {
          id
          username
          email
          firstName
          lastName
        }
      }
      comments {
        id
        content
        createdAt
        author {
          id
          username
          email
          firstName
          lastName
        }
      }
      activityLogs {
        id
        action
        description
        details
        createdAt
        actor {
          id
          username
          email
        }
      }
    }
  }
`;

export const GET_WORKFLOW_INSTANCES = gql`
  ${WORKFLOW_INSTANCE_FRAGMENT}
  query GetWorkflowInstances($status: String, $initiatedBy: ID) {
    workflowInstances(status: $status, initiatedBy: $initiatedBy) {
      ...WorkflowInstanceFields
      workflowTemplate {
        id
        name
        code
        category
        icon
        color
      }
    }
  }
`;

export const GET_MY_WORKFLOW_INSTANCES = gql`
  ${WORKFLOW_INSTANCE_FRAGMENT}
  query GetMyWorkflowInstances {
    myWorkflowInstances {
      ...WorkflowInstanceFields
      workflowTemplate {
        id
        name
        code
        category
        icon
        color
      }
    }
  }
`;

export const GET_MY_PENDING_APPROVALS = gql`
  query GetMyPendingApprovals {
    myPendingApprovals {
      id
      stepNumber
      status
      comment
      createdAt
      workflowInstance {
        id
        instanceCode
        title
        description
        status
        currentStepNumber
        workflowTemplate {
          id
          name
          code
          icon
          color
        }
      }
    }
  }
`;

// ============================================
// MUTATIONS
// ============================================

export const CREATE_WORKFLOW_TEMPLATE = gql`
  ${WORKFLOW_TEMPLATE_FRAGMENT}
  mutation CreateWorkflowTemplate($input: CreateWorkflowTemplateInput!) {
    createWorkflowTemplate(input: $input) {
      ...WorkflowTemplateFields
    }
  }
`;

export const UPDATE_WORKFLOW_TEMPLATE = gql`
  ${WORKFLOW_TEMPLATE_FRAGMENT}
  mutation UpdateWorkflowTemplate($id: ID!, $input: UpdateWorkflowTemplateInput!) {
    updateWorkflowTemplate(id: $id, input: $input) {
      ...WorkflowTemplateFields
    }
  }
`;

export const CREATE_WORKFLOW_INSTANCE = gql`
  ${WORKFLOW_INSTANCE_FRAGMENT}
  mutation CreateWorkflowInstance($input: CreateWorkflowInstanceInput!) {
    createWorkflowInstance(input: $input) {
      ...WorkflowInstanceFields
    }
  }
`;

export const COMPLETE_STEP = gql`
  mutation CompleteStep($input: CompleteStepInput!) {
    completeStep(input: $input)
  }
`;

export const RESPOND_TO_APPROVAL = gql`
  mutation RespondToApproval($input: RespondToApprovalInput!) {
    respondToApproval(input: $input)
  }
`;

export const CREATE_WORKFLOW_COMMENT = gql`
  mutation CreateWorkflowComment($input: CreateWorkflowCommentInput!) {
    createWorkflowComment(input: $input) {
      id
      content
      createdAt
      author {
        id
        username
        email
        firstName
        lastName
      }
    }
  }
`;

export const CANCEL_WORKFLOW_INSTANCE = gql`
  mutation CancelWorkflowInstance($id: ID!, $reason: String!) {
    cancelWorkflowInstance(id: $id, reason: $reason)
  }
`;

// ============================================
// EMPLOYEE ONBOARDING
// ============================================

export const START_EMPLOYEE_ONBOARDING = gql`
  ${WORKFLOW_INSTANCE_FRAGMENT}
  mutation StartEmployeeOnboarding($input: StartEmployeeOnboardingInput!) {
    startEmployeeOnboarding(input: $input) {
      ...WorkflowInstanceFields
    }
  }
`;

export const SETUP_EMPLOYEE_ONBOARDING_WORKFLOW = gql`
  mutation SetupEmployeeOnboardingWorkflow {
    setupEmployeeOnboardingWorkflow
  }
`;

export const GET_EMPLOYEE_ONBOARDING_STATUS = gql`
  query GetEmployeeOnboardingStatus($employeeId: ID!) {
    getEmployeeOnboardingStatus(employeeId: $employeeId) {
      employee {
        id
        fullName
        position
        department
        startDate
        isActive
      }
      workflowInstance {
        id
        instanceCode
        title
        status
        currentStepNumber
        createdAt
      }
      completionPercentage
    }
  }
`;
